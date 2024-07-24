document.addEventListener('DOMContentLoaded', () => {
    const clickButton = document.getElementById('clickButton');

    clickButton.addEventListener('click', handleClick);
});

async function handleClick() {
    try {
        const response = await fetch('/game/click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: 1 }), // Modify this as needed to send appropriate data
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Click result:', result);

        // Update the UI based on the result
        // For example, you might update the number of clicks, player stats, enemy stats, etc.
    } catch (error) {
        console.error('Error:', error);
    }
}
