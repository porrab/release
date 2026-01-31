import { styled } from "@mui/material/styles";
import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
  text?: string;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, text, ...other } = props;
  return (
    <Grid container sx={{ alignItems: "center" }}>
      {text && (
        <Typography variant="body2" sx={{ ml: 1 }}>
          {text}
        </Typography>
      )}
      <IconButton {...other}>{props.children}</IconButton>
    </Grid>
  );
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(90deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default ExpandMore;
