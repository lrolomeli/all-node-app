// Invite token → session (stored in localStorage as sessionToken)
class InviteSessionAuth {
  constructor() {
    this.sessionToken = localStorage.getItem('sessionToken');
    this.setupStyles();
    this.consumeInviteFromUrl();
  }

  setupStyles() {
    if (document.getElementById('invite-auth-styles')) return;

    const style = document.createElement('style');
    style.id = 'invite-auth-styles';
    style.textContent = `
            .invite-auth-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }

            .invite-auth-modal {
                background: white;
                padding: 32px;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 440px;
                width: 92%;
            }

            .invite-auth-modal h2 {
                margin-bottom: 8px;
                color: #333;
                font-size: 1.35em;
            }

            .invite-auth-modal p {
                margin-bottom: 20px;
                color: #666;
                font-size: 0.95em;
                line-height: 1.4;
            }

            .invite-auth-input {
                width: 100%;
                padding: 12px 14px;
                font-size: 14px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                margin-bottom: 16px;
                font-family: ui-monospace, monospace;
                box-sizing: border-box;
            }

            .invite-auth-input:focus {
                outline: none;
                border-color: #667eea;
            }

            .invite-auth-submit {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            }

            .invite-auth-submit:hover:not(:disabled) {
                opacity: 0.95;
            }

            .invite-auth-submit:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .invite-auth-error {
                color: #dc3545;
                margin-top: 12px;
                font-size: 14px;
            }
        `;
    document.head.appendChild(style);
  }

  async consumeInviteFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (!invite || !invite.trim()) return;

    try {
      const res = await fetch('/api/auth/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteToken: invite.trim() }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.sessionToken) return;
      this.sessionToken = data.sessionToken;
      localStorage.setItem('sessionToken', this.sessionToken);
      params.delete('invite');
      const q = params.toString();
      const url = window.location.pathname + (q ? `?${q}` : '') + window.location.hash;
      window.history.replaceState({}, '', url);
    } catch {
      /* ignore */
    }
  }

  showInviteModal() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'invite-auth-overlay';

      overlay.innerHTML = `
                <div class="invite-auth-modal">
                    <h2>Invitación requerida</h2>
                    <p>Pega el token de invitación que te compartieron (o abre un enlace con <code>?invite=…</code>).</p>
                    <textarea class="invite-auth-input" rows="3" placeholder="Token de invitación" autocomplete="off" spellcheck="false"></textarea>
                    <button type="button" class="invite-auth-submit">Canjear invitación</button>
                    <div class="invite-auth-error"></div>
                </div>
            `;

      document.body.appendChild(overlay);

      const textarea = overlay.querySelector('.invite-auth-input');
      const submit = overlay.querySelector('.invite-auth-submit');
      const errorEl = overlay.querySelector('.invite-auth-error');

      textarea.focus();

      const handleSubmit = async () => {
        const inviteToken = textarea.value.trim();
        if (!inviteToken) {
          errorEl.textContent = 'Introduce un token.';
          return;
        }

        submit.disabled = true;
        submit.textContent = 'Comprobando…';
        errorEl.textContent = '';

        try {
          const response = await fetch('/api/auth/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inviteToken }),
          });

          if (response.ok) {
            const data = await response.json();
            this.sessionToken = data.sessionToken;
            localStorage.setItem('sessionToken', this.sessionToken);
            document.body.removeChild(overlay);
            resolve(this.sessionToken);
            return;
          }

          let msg = 'Token no válido o ya no se puede usar.';
          try {
            const err = await response.json();
            if (err.code === 'expired') msg = 'Esta invitación expiró.';
            else if (err.code === 'revoked') msg = 'Esta invitación fue revocada.';
            else if (err.code === 'depleted') msg = 'Esta invitación ya no tiene usos disponibles.';
          } catch {
            /* keep default */
          }
          errorEl.textContent = msg;
        } catch {
          errorEl.textContent = 'Error de conexión. Inténtalo de nuevo.';
        }

        submit.disabled = false;
        submit.textContent = 'Canjear invitación';
      };

      submit.addEventListener('click', handleSubmit);
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      });
    });
  }

  async authenticatedFetch(url, options = {}) {
    if (this.sessionToken) {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'x-session-token': this.sessionToken,
        },
      });

      if (response.status !== 401) {
        return response;
      }

      this.sessionToken = null;
      localStorage.removeItem('sessionToken');
    }

    await this.showInviteModal();

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-session-token': this.sessionToken,
      },
    });
  }

  logout() {
    this.sessionToken = null;
    localStorage.removeItem('sessionToken');
  }
}

window.pinAuth = new InviteSessionAuth();
