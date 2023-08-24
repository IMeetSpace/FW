export const getFormattedText = (text) => {
  return text
    .trim()
    .replace(/(?:\n+)/g, '\n')
    .split('\n')
    .map((string, index) => (
      <span key={index}>
        {string}
        <br />
      </span>
    ));
};
