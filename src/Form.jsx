import { Sheet, Typography, Alert, TextField, Slider, Button } from "@mui/joy"
import { useState } from "react"
import { callFontsApi } from "./api"

export const Form = ({ onData }) => {

  const [fontName, setFontName] = useState("")
  const [weightRange, setWeightRange] = useState([300, 800])

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState("")

  const handleRange = (_, newVal) => {
    setAlert('')
    setWeightRange(newVal)
  }

  const handleName = (e) => {
    setAlert('')
    setFontName(e.target.value)
  }


  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(event)
    setAlert('')
    setLoading(true)

    const res = await callFontsApi(fontName, weightRange)
      .catch(err => {
        console.log(err)
        setAlert('Failed to fetch. The font may be spelled incorrectly or not be a variable font.')
      })
    setLoading(false)

    if (res) {
      onData(res)
    }
  }

  return (

    <Sheet
      sx={{
        maxWidth: 350,
        mx: 'auto',
        my: 4,
        py: 3,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'md',
      }}
      variant='outlined'>
      <div>
        <Typography level='h4' component="h1">
          <b>Variable font picker</b>
        </Typography>
        <Typography level='body2'>Enter the font name to continue</Typography>
      </div>
      {!!alert && (
        <Alert color='danger'>{alert}</Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          name="font"
          type="text"
          placeholder="Roboto Flex"
          label="Font name"
          value={fontName}
          onChange={handleName}
        />
        <Typography id="weight-range" sx={{
          mt: 2,
          mb: 3,
        }}>
          Font weight
        </Typography>
        <Slider
          aria-labelledby='weight-range'
          getAriaLabel={() => 'Font weight range'}
          value={weightRange}
          onChange={handleRange}
          min={100}
          max={1000}
          step={50}
          valueLabelDisplay='on'
        />
        <Button
          disabled={loading}
          type='submit'
          sx={{
            mt: 2,
            width: '100%'
          }}>
          Continue
        </Button>
      </form>
    </Sheet>
  )
}