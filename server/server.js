const express = require("express");
const FileUpload = require("express-fileupload");
const cors = require("cors");
const hbs = require("handlebars");
const UtilisateurRouter = require("./routes/Utilisateur.routes.js");
const VoieRouter = require("./routes/Voie.routes.js");
const ParametreRouter = require("./routes/Parametre.routes.js");
const expressLayouts = require("express-ejs-layouts");
const Migration = require("./database/migrations/Migration.js");
const CaisseRouter = require("./routes/Caisse.routes.js");
const FormeRouter = require("./routes/Forme.routes.js");
const FabricantRouter = require("./routes/Fabricant.routes.js");
const FamilleRouter = require("./routes/Famille.routes.js");
const UniteRouter = require("./routes/Unite.routes.js");
const Mode_expeditionRouter = require("./routes/Mode_expedition.routes.js");
const EmplacementRouter = require("./routes/Emplacement.routes.js");
const FournisseurRouter = require("./routes/Fournisseur.routes.js");
const LoginRouter = require("./routes/Login.routes.js");
const SocieteRouter = require("./routes/Societe.routes.js");
const ProduitRouter = require("./routes/Produit.routes.js");
const RavitaillementRouter = require("./routes/Ravitaillement.routes.js");
const AjustementRouter = require("./routes/Ajustement.routes.js");
const GuichetRouter = require("./routes/Guichet.routes.js");
const VenteRouter = require("./routes/Vente.routes.js");
const AccueilRouter = require("./routes/Accueil.routes.js");
const EntrepriseRouter = require("./routes/Entreprise.routes.js");
const DownloadRouter = require("./routes/Download.routes.js");
const path = require("path");
const Marge_beneficiaireRouter = require("./routes/Marge_beneficiaire.routes.js");
const NotificationRouter = require("./routes/Notification.routes.js");
const { getNotification } = require("./controllers/Notification.controller.js");

//const ImportRouter = require("./modules/importProducts/routes/Import.route");
const { getModules } = require('./modules/moduleRegistry');
const fs = require('fs');
const { Console } = require('console');

// Create a write stream to the log file
const logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });

// Create a custom console instance that writes to both the console and the log file
const consoleWithLog = new Console(process.stdout, logStream);

// Override the default console object with the custom console instance
console = consoleWithLog;

console.log("\n\n\tMODE ", process.env.NODE_ENV, "\n\n");

const { app, http, socketIO } = require("./utils/utils.js");

app.use(expressLayouts);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(FileUpload());
app.set("view engine", "handlebars");
//  app.engine("handlebars", handlebars.engines);

if (require.main === module){
  hbs.registerHelper("ifNull", function (v) {
    if (v == null) {
      return "";
    }
  });
  
  socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("getNotification", async (data) => {
      getNotification();
    });
  
    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
      socket.disconnect();
    });
  });
}

app.use(LoginRouter);
app.use(AccueilRouter);

app.use(UtilisateurRouter);
app.use(VoieRouter);
app.use(CaisseRouter);
app.use(EmplacementRouter);
app.use(FormeRouter);
app.use(FamilleRouter);
app.use(FabricantRouter);
app.use(Mode_expeditionRouter);
app.use(UniteRouter);
app.use(ParametreRouter);
app.use(FournisseurRouter);
app.use(SocieteRouter);
app.use(ProduitRouter);
app.use(RavitaillementRouter);
app.use(AjustementRouter);
app.use(GuichetRouter);
app.use(VenteRouter);
app.use(EntrepriseRouter);
app.use(DownloadRouter);
app.use(Marge_beneficiaireRouter);
app.use(NotificationRouter);

//app.use( ImportRouter );

// Register modules
getModules().forEach( (module) => {
  for( let route of module.routers ){
    app.use( `/modules/${module.slug}`, route );
  }
  console.log(`Module ${module.name} loaded!`);
  //app.use(`/api/${module.name.toLowerCase().replace(/\s+/g, '-')}`, module.handler);
});

// Migration();

if (require.main === module) { // Run ONly if this file is being executed but not being imported into another file
  http.listen(process.env.PORT, () => {
    console.log(`SERVEUR LANCE SUR LE PORT ${process.env.PORT} ...`);
  });
}

// Export the app
module.exports = app;