import { List } from "@mui/joy";
import { Checkbox } from "@mui/joy";
import { ListItem } from "@mui/joy";
import { Box } from "@mui/joy";
import { Typography } from "@mui/joy";

export const CharsetChips = ({ charsets, selected, onSelect, onUnselect }) => {

  return (
    <Box sx={{maxWidth: 350, mx: 'auto'}}>
      <Typography id="rank" level="body2" fontWeight="lg" sx={{ mb: 1.5 }}>
        Charsets
      </Typography>
      <Box role="group" aria-labelledby="rank">
        <List
          row
          wrap
          sx={{
            '--List-gap': '8px',
            '--List-item-radius': '20px',
            '--List-item-minHeight': '32px',
          }}
        >
          {charsets?.map(
            (item) => (
              <ListItem key={item}>
                <Checkbox
                  size="sm"
                  disableIcon
                  overlay
                  label={item}
                  checked={selected.includes(item)}
                  variant={selected.includes(item) ? 'soft' : 'outlined'}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelect(item);
                    } else {
                      onUnselect(item);
                    }
                  }}
                  componentsProps={{
                    input: {
                      sx: {
                        position: 'relative'
                      },
                    },
                    action: ({ checked }) => ({
                      sx: checked
                        ? {
                          border: '1px solid',
                          borderColor: 'primary.500',
                        }
                        : {},
                    }),
                  }}
                />
              </ListItem>
            ),
          )}
        </List>
      </Box>
    </Box>
  )
}