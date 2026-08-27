export default function decorate(block) {
  const cards = [...block.children];
  cards.forEach((card) => {
    card?.classList.add('card-item');
    const cardnumber = card.querySelector('h4');
    cardnumber?.classList.add('card-number');
    const cardimg = card.querySelector('p:has(img)');
    cardimg?.classList.add('card-image');
    const cardcontent = card.querySelector('h2');
    cardcontent?.classList.add('card-title');
    const cardtext = card.querySelector('p:not(:has(img))');
    cardtext?.classList.add('card-text');
  });
}
