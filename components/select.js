import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { Select as S } from "@material-ui/core";

export default function Select({ label, id, value, onChange, items }) {
  return (
    <FormControl
      variant="outlined"
      style={{
        width: "95%",
        maxWidth: "95vw",
      }}
    >
      <InputLabel id={id + "_label"}>{label}</InputLabel>
      <S
        labelId={id + "_label"}
        id={id}
        value={value}
        onChange={onChange}
        label={label}
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={index}>
            {item}
          </MenuItem>
        ))}
      </S>
    </FormControl>
  );
}
