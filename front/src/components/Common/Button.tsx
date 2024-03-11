import { Button as MuiButton, ButtonProps } from "@mui/material";

const Button = ({
  children,
  onClick,
  variant = "contained",
  color = "primary",
}: ButtonProps) => (
  <MuiButton variant={variant} color={color} onClick={onClick}>
    {children}
  </MuiButton>
);

export default Button;
