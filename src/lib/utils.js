export function expandRange(input) {
  let resultSet = new Set();
  let i = 0;

  while (i < input.length) {
    if (i + 2 < input.length && input[i + 1] === '-') {
      let start = input[i];
      let end = input[i + 2];

      // Ensure the start and end are in the correct order
      if (start <= end) {
        // Expand the range
        for (let charCode = start.charCodeAt(0); charCode <= end.charCodeAt(0); charCode++) {
          resultSet.add(String.fromCharCode(charCode));
        }
      } else {
        // Invalid range, include the characters as is
        resultSet.add(start);
        resultSet.add('-');
        resultSet.add(end);
      }

      // Move past the range (3 characters)
      i += 3;
    } else {
      // Just a single character, add to the result
      resultSet.add(input[i]);
      i++;
    }
  }

  return Array.from(resultSet).join('');
}

export function generateExamples(n, length, charset) {
  const examples = [];
  for (let i = 0; i < n; i++) {
    const example = [];
    for (let j = 0; j < length; j++) {
      example.push(charset[Math.floor(Math.random() * charset.length)]);
    }
    examples.push(example.join(""));
  }
  return examples;
}

function isContinuous(arr) {
  return arr.every((value, index) => index === 0 || value.charCodeAt(0) === arr[index - 1].charCodeAt(0) + 1);
}

export function settingsFromExamples(examples) {
  examples = examples.split("\n").filter(Boolean);

  const length = examples.reduce((acc, example) => Math.max(acc, example.length), 0);
  let charset = Array.from(new Set(examples.join("").split(""))).toSorted().join("");

  // Guess missing characters from common charset like 0-9, A-Z, a-z, 0-9a-f
  const ranges = ["0-9a-f", "0-9", "A-Z", "a-z"];
  for (const range of ranges.map(expandRange)) {
    const regex = new RegExp(String.raw`[${range}]+`, "g");
    charset = charset.replace(regex, (match => {
      // If charset has more than half of a range and is not continuous
      if (match.length > range.length / 2 && !isContinuous(match.split(""))) {
        return range;
      }
      return match;
    }));
  }
  // Replace long ranges with their shorthand (eg. 0123456789 -> 0-9)
  ranges.forEach(range => {
    charset = charset.replace(expandRange(range), range);
  });

  return { length, charset };
}

export function formatBigNumber(n, copyable = false) {
  if (n >= 1e13) {
    return n.toLocaleString(undefined, { notation: 'scientific' });
  } else {
    return copyable ? n.toString() : n.toLocaleString();
  }
}

export function selectOnFocus(node) {
  function handleFocus() {
    node.select();
  }

  node.addEventListener('focus', handleFocus);

  return {
    destroy() {
      node.removeEventListener('focus', handleFocus);
    }
  };
}

export function validateInteger(node, store) {
  store.subscribe(value => {
    if (value === null) {
      node.setCustomValidity('Input is required');
    } else if (value < 1) {
      node.setCustomValidity('Value must be at least 1');
    } else {
      node.setCustomValidity('');
    }
    node.reportValidity();
  });
}

export function validateFloat(node, store) {
  store.subscribe(value => {
    if (value === null) {
      node.setCustomValidity('Input is required');
    } else if (value < 0) {
      node.setCustomValidity('Value must be at least 0');
    } else {
      node.setCustomValidity('');
    }
    node.reportValidity();
  });
}
