import React, { useState, useContext } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Link,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import { Visibility, VisibilityOff, LockOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { system } from "../../config.json";
import logo from "../../assets/logo.png"; // Logo Importado

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      © {new Date().getFullYear()}
      {" - "}
      <Link color="inherit" href={system.url || "https://wasap.com.br"}>
        {system.name}
      </Link>
      {"."}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f6f8", // Cor de fundo
  },
  logo: {
    width: "auto",  // O tamanho original da logo
    height: "100px", // Altura ajustada para exibir o logo no tamanho ideal
    marginBottom: theme.spacing(2), // Espaçamento entre o logo e a caixa de login
  },
  paperContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    backgroundColor: "#4d04a4",
    "&:hover": {
      backgroundColor: "#2c025e",
    },
  },
  link: {
    marginTop: theme.spacing(2),
    textAlign: "center",
  },
  input: {
    borderRadius: theme.shape.borderRadius,
  },
  loadingIndicator: {
    marginLeft: theme.spacing(1),
  },
  lockIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

const Login = () => {
  const classes = useStyles();
  const { handleLogin, loading, error } = useContext(AuthContext);

  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* Logo exibida no topo, acima da caixa de login */}
      <img src={logo} alt="Logo" className={classes.logo} />

      <Container component="main" maxWidth="xs">
        <div className={classes.paperContainer}>
          <Avatar className={classes.lockIcon}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            {i18n.t("login.title")}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={i18n.t("login.form.email")}
              name="email"
              autoComplete="email"
              autoFocus
              value={user.email}
              onChange={handleChangeInput}
              InputProps={{
                className: classes.input,
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={i18n.t("login.form.password")}
              type={showPassword ? "text" : "password"}
              id="password"
              value={user.password}
              onChange={handleChangeInput}
              autoComplete="current-password"
              InputProps={{
                className: classes.input,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {i18n.t("login.buttons.submit")}
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.loadingIndicator}
                />
              )}
            </Button>
            <Grid container className={classes.link}>
              <Grid item xs>
                <Link
                  href="https://api.whatsapp.com/send?phone=5554981346623"
                  variant="body2"
                  target="_blank"
                  rel="noopener"
                >
                  Preciso de Ajuda
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
};

export default Login;
