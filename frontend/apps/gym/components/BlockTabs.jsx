export default function BlockTabs({ currentBlock, onSelect, hidden }) {
  return (
    <div className={`block-tabs${hidden ? ' hidden' : ''}`}>
      {['A', 'B'].map(block => (
        <button
          key={block}
          type="button"
          className={`block-tab${currentBlock === block ? ' active' : ''}`}
          onClick={() => onSelect(block)}
        >
          BLOQUE {block}
        </button>
      ))}
    </div>
  )
}
