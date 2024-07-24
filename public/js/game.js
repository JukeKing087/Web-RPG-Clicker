document.addEventListener('DOMContentLoaded', () => {
    const clickButton = document.getElementById('clickButton');

    clickButton.addEventListener('click', handleClick);

    // Fetch enemy data from the server
    fetch('/game/enemy')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Expect JSON response
        })
        .then(data => {
            document.getElementById('enemyName').textContent = data.name;
            document.getElementById('enemyLevel').textContent = data.level;
            document.getElementById('enemyAttack').textContent = data.attack;
            document.getElementById('enemyDefense').textContent = data.defense;
            document.getElementById('enemyHealth').textContent = data.health;
        })
        .catch(error => {
            console.error('Error fetching enemy data:', error);
        });
});

async function handleClick() {
    try {
        const response = await fetch('/game/click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: 1 }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Click result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}
