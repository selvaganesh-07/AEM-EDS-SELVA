export default function decorate(block) {   
    const cards = [...block.children];
 cards.forEach((card) => {
    card?.classList.add('section-card');
    const cardnumber = card.querySelector('h4');
    cardnumber?.classList.add('section-number');
    const cardimg = card.querySelector('p:has(img)');
    cardimg?.classList.add('section-image');
    const cardcontent = card.querySelector('h2');
    cardcontent?.classList.add('section-title');
    const cardtext = card.querySelector('p:not(:has(img))');
    cardtext?.classList.add('section-text');
 });  
}
