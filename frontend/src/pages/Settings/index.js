import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import openSocket from "socket.io-client";

import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { toast } from "react-toastify";

import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid"; // Adicionado para layout responsivo
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  container: {
    width: "100%",
    maxWidth: 900, // Aumentado para acomodar duas colunas
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 13, // Borda arredondada conforme solicitado
    boxShadow: theme.shadows[3], // Sombra mais forte para modernizar
    backgroundColor: theme.palette.background.paper,
  },
  switchContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  selectControl: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 13,
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
  },
  checked: {},
}))((props) => <Switch {...props} />);

const Settings = () => {
  const classes = useStyles();
  const history = useHistory();

  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

    socket.on("settings", (data) => {
      if (data.action === "update") {
        setSettings((prevState) => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex((s) => s.key === data.setting.key);
          aux[settingIndex].value = data.setting.value;
          return aux;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChangeBooleanSetting = async (e) => {
    const selectedValue = e.target.checked ? "enabled" : "disabled";
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, { value: selectedValue });
      toast.success(i18n.t("settings.success"));
      history.go(0);
    } catch (err) {
      toastError(err);
    }
  };

  const handleChangeSetting = async (e) => {
    const selectedValue = e.target.value;
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, { value: selectedValue });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const getSettingValue = (key) => {
    const { value } = settings.find((s) => s.key === key);
    return value;
  };

  return (
   <div className={classes.root}>
     <Container className={classes.container}>
       <Typography variant="h5" className={classes.sectionTitle}>
         {i18n.t("settings.title")}
       </Typography>
       <Grid container spacing={2} className={classes.gridContainer}>
         {/* Dividindo as configurações em duas colunas */}
         <Grid item xs={12} sm={6}>
           <div className={classes.switchContainer}>
             {[
               "userCreation",
               "allTicket",
               "CheckMsgIsGroup",
               "call",
               "sideMenu"
             ].map((key) => (
               <Paper className={classes.paper} key={key}>
                 <Tooltip title={i18n.t(`settings.settings.${key}.note`)}>
                   <FormControlLabel
                     control={
                       <IOSSwitch
                         checked={
                           settings &&
                           settings.length > 0 &&
                           getSettingValue(key) === "enabled"
                         }
                         onChange={handleChangeBooleanSetting}
                         name={key}
                       />
                     }
                     label={i18n.t(`settings.settings.${key}.name`)}
                   />
                 </Tooltip>
               </Paper>
             ))}
           </div>
         </Grid>
         <Grid item xs={12} sm={6}>
           <div className={classes.switchContainer}>
             {[
               "quickAnswer",
               "closeTicketApi",
               "darkMode",
               "ASC",
               "created"
             ].map((key) => (
               <Paper className={classes.paper} key={key}>
                 <Tooltip title={i18n.t(`settings.settings.${key}.note`)}>
                   <FormControlLabel
                     control={
                       <IOSSwitch
                         checked={
                           settings &&
                           settings.length > 0 &&
                           getSettingValue(key) === "enabled"
                         }
                         onChange={handleChangeBooleanSetting}
                         name={key}
                       />
                     }
                     label={i18n.t(`settings.settings.${key}.name`)}
                   />
                 </Tooltip>
               </Paper>
             ))}
           </div>
         </Grid>
       </Grid>
     </Container>

     {/* Configuração do timeCreateNewTicket */}
<Container className={classes.container}>
  <div className={classes.selectControl}>
    <Tooltip title={i18n.t("settings.settings.timeCreateNewTicket.note")}>
      <Paper className={classes.paper} elevation={3}>
        {/* Texto simples dentro do quadrado sombreado */}
        <Typography variant="body1" color="textPrimary">
          {i18n.t("settings.settings.timeCreateNewTicket.name")}
        </Typography>
        
        {/* Caixa de seleção */}
        <Select
          margin="dense"
          variant="outlined"
          native
          id="timeCreateNewTicket-setting"
          name="timeCreateNewTicket"
          value={
            settings && settings.length > 0 && getSettingValue("timeCreateNewTicket")
          }
          onChange={handleChangeSetting}
        >
          {[10, 30, 60, 300, 1800, 3600, 7200, 21600, 43200, 86400, 604800, 1296000, 2592000].map(
            (value) => (
              <option key={value} value={value}>
                {i18n.t(`settings.settings.timeCreateNewTicket.options.${value}`)}
              </option>
            )
          )}
        </Select>
      </Paper>
    </Tooltip>
  </div>
</Container>
   </div>
 );
};

export default Settings;