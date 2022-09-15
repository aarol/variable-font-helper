
export async function callFontsApi(font, weights) {
  weights.sort()
  font = font.replace(" ", "+")
  const weightRange = `${weights[0]}..${weights[1]}`
  const url = new URL(
    `https://fonts.googleapis.com/css2?family=${font}:wght@${weightRange}&display=swap`
  )
  const res = await fetch(url)
  return res.text()
}

const charsetRegex = /\/\*(.*)\*\//g

export function getCharsets(data) {
  const res = [...data.matchAll(charsetRegex)].map(e => e[1].trim())
  console.log(res);
  return res
}

// Outer group has whole block, inner group is the charset
const extractRegex = /\/\*(.*)\*\/[\s\S]*?}/g

export function extractSelectedCharsets(selected, data) {
  let output = ""

  const matches = [...data.matchAll(extractRegex)]

  matches.forEach(match => {
    if (selected.includes(match[1].trim())) {
      output += match[0] + "\n"
    }
  })

  return output
}