// PIN Authentication System
class PinAuth {
    constructor() {
        this.sessionToken = localStorage.getItem('sessionToken');
        this.setupStyles();
    }

    setupStyles() {
        if (document.getElementById('pin-auth-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'pin-auth-styles';
        style.textContent = `
            .pin-overlay {
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
            
            .pin-modal {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
            }
            
            .pin-modal h2 {
                margin-bottom: 10px;
                color: #333;
                font-size: 1.5em;
            }
            
            .pin-modal p {
                margin-bottom: 30px;
                color: #666;
            }
            
            .pin-input {
                width: 100%;
                padding: 15px;
                font-size: 24px;
                text-align: center;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                margin-bottom: 20px;
                letter-spacing: 8px;
                font-family: monospace;
            }
            
            .pin-input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .pin-submit {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .pin-submit:hover {
                transform: translateY(-2px);
            }
            
            .pin-submit:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .pin-error {
                color: #dc3545;
                margin-top: 15px;
                font-size: 14px;
            }
            
            .pin-keypad {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin: 20px 0;
            }
            
            .pin-key {
                padding: 15px;
                background: #f8f9fa;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .pin-key:hover {
                background: #e9ecef;
                border-color: #667eea;
            }
            
            .pin-key.wide {
                grid-column: span 3;
            }
        `;
        document.head.appendChild(style);
    }

    showPinModal() {
        return new Promise((resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.className = 'pin-overlay';
            
            overlay.innerHTML = `
                <div class="pin-modal">
                    <h2>🔐 Enter PIN</h2>
                    <p>Please enter your 6-digit PIN to continue</p>
                    <input type="password" class="pin-input" maxlength="6" placeholder="••••••" autocomplete="off">
                    <div class="pin-keypad">
                        <button class="pin-key" data-key="1">1</button>
                        <button class="pin-key" data-key="2">2</button>
                        <button class="pin-key" data-key="3">3</button>
                        <button class="pin-key" data-key="4">4</button>
                        <button class="pin-key" data-key="5">5</button>
                        <button class="pin-key" data-key="6">6</button>
                        <button class="pin-key" data-key="7">7</button>
                        <button class="pin-key" data-key="8">8</button>
                        <button class="pin-key" data-key="9">9</button>
                        <button class="pin-key" data-key="clear">Clear</button>
                        <button class="pin-key" data-key="0">0</button>
                        <button class="pin-key" data-key="backspace">⌫</button>
                    </div>
                    <button class="pin-submit">Submit</button>
                    <div class="pin-error"></div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const input = overlay.querySelector('.pin-input');
            const submit = overlay.querySelector('.pin-submit');
            const error = overlay.querySelector('.pin-error');
            const keypad = overlay.querySelector('.pin-keypad');
            
            // Focus input
            input.focus();
            
            // Keypad functionality
            keypad.addEventListener('click', (e) => {
                if (!e.target.classList.contains('pin-key')) return;
                
                const key = e.target.dataset.key;
                
                if (key === 'clear') {
                    input.value = '';
                } else if (key === 'backspace') {
                    input.value = input.value.slice(0, -1);
                } else if (input.value.length < 6) {
                    input.value += key;
                }
                
                input.focus();
            });
            
            // Auto-submit when 6 digits entered
            input.addEventListener('input', () => {
                if (input.value.length === 6) {
                    setTimeout(() => submit.click(), 200);
                }
            });
            
            // Submit handler
            const handleSubmit = async () => {
                const pin = input.value;
                
                if (pin.length !== 6) {
                    error.textContent = 'PIN must be 6 digits';
                    return;
                }
                
                submit.disabled = true;
                submit.textContent = 'Verifying...';
                error.textContent = '';
                
                try {
                    const response = await fetch('/api/auth/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pin })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.sessionToken = data.sessionToken;
                        localStorage.setItem('sessionToken', this.sessionToken);
                        document.body.removeChild(overlay);
                        resolve(this.sessionToken);
                    } else {
                        error.textContent = 'Invalid PIN. Please try again.';
                        input.value = '';
                        input.focus();
                    }
                } catch (err) {
                    error.textContent = 'Connection error. Please try again.';
                }
                
                submit.disabled = false;
                submit.textContent = 'Submit';
            };
            
            submit.addEventListener('click', handleSubmit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSubmit();
            });
            
            // Only allow numbers
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Enter' && e.key !== 'Backspace') {
                    e.preventDefault();
                }
            });
        });
    }

    async authenticatedFetch(url, options = {}) {
        // First try with existing session token
        if (this.sessionToken) {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'x-session-token': this.sessionToken
                }
            });
            
            if (response.status !== 401) {
                return response;
            }
            
            // Session expired, clear it
            this.sessionToken = null;
            localStorage.removeItem('sessionToken');
        }
        
        // Need authentication
        await this.showPinModal();
        
        // Retry with new session token
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'x-session-token': this.sessionToken
            }
        });
    }

    logout() {
        this.sessionToken = null;
        localStorage.removeItem('sessionToken');
    }
}

// Global instance
window.pinAuth = new PinAuth();