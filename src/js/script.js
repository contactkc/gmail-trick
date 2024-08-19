const submitBtn = document.getElementById('generator__submit');
const resultDisplay = document.getElementById('result__display');
const resultDiv = document.getElementById('generator__result');
const inputField = document.getElementById('generator__input');
const regex = /@gmail\.com$/i;

const generateAliases = (email) => {
    // Split the email into local part (before '@') and domain (after '@')
    const [localPart, domain] = email.split('@');
    const results = []; // Array to store generated aliases
  
    // Recursive function to generate all possible email aliases
    function generateDots(current, remaining) {
        // Stop if we have reached the maximum number of results
        if (results.length >= 128) return;

        // If there are no remaining characters, add the current alias to results
        if (remaining.length === 0) {
            results.push(current.join('') + '@' + domain);
            return;
        }

        // Include the next character without a dot
        current.push(remaining[0]);
        generateDots(current, remaining.slice(1)); // Recursively process the rest
        current.pop(); // Backtrack: remove the character to try a new combination

        // Include the next character with a dot (if not at the start of the local part)
        if (current.length > 0) {
            current.push('.'); // Add a dot before the character
            current.push(remaining[0]); // Add the character
            generateDots(current, remaining.slice(1)); // Recursively process the rest
            current.pop(); // Backtrack: remove the character
            current.pop(); // Backtrack: remove the dot
        }
    }

    // Start the recursion with an empty current array and the local part of the email
    generateDots([], localPart.split(''));

    // Return the array of generated aliases
    return results;
};

// Checks if it is a valid GMAIL through regex
const isEmail = (email) => regex.test(email);

const generate = () => {
    const emailInput = inputField.value;
    if (!isEmail(emailInput) || emailInput === '') {
        alert('Please enter a valid email!');
    } else {
        const aliases = generateAliases(emailInput);

        // Clear existing results
        resultDisplay.innerHTML = '';

        // Show the results container
        resultDiv.classList.remove('hidden');

        // Insert each alias into a new <li> element
        aliases.forEach((elem) => {
            const li = document.createElement('li');
            li.textContent = elem;
            resultDisplay.appendChild(li);
        });
    }
};

// Add click event listener to the submit button
submitBtn.addEventListener('click', generate);

// Add keydown event listener to the input field
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        generate();
        event.preventDefault();
    }
});