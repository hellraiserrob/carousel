import { Card } from "./interfaces"

// template for new card
export function cardTemplate(card: Card):string {
  return `<div class="card">
    <div class="card__style">
      <div class="card__title">
        <h2>${card.title}</h2>
        <h3>${card.summary}</h3>
      </div>
      ${card.image ? `<div class="card__image">
        <img src="${card.image.src}" alt="" style="aspect-ratio: ${card.image.aspect}">
      </div>` : ''}
      <div class="card__text">
        ${card.text}
      </div>
      <div class="card__actions">
        <button>Add</button>
      </div>
    </div>
  </div><!-- /card -->`
}