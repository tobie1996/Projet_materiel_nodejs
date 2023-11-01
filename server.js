const pool = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const pg = require("pg");
const app = express();
const path = require("path");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// PARTIE INDEX


app.get("/index", (req, res) => {
  pool.query("select * from personnel order by id asc", (error1, results1) => {
    if (error1) {
      throw error1;
    }
    const personnel = results1.rows;

    pool.query("select * from materiel order by id asc", (error2, results2) => {
      if (error2) {
        throw error2;
      }
      const materiel = results2.rows;

      pool.query("select * from emprunt order by id asc", (error3, results3) => {
        if (error3) {
          throw error3;
        }
        const emprunt = results3.rows;

        res.render("admin/index", { personnel: personnel, materiel: materiel, emprunt: emprunt });
      });
    });
  });
});

/// GESTION DU MATERIEL

app.post("/add", (req, res) => {
  const { id, nature, date_entrer, date_fin, info, cout, etat, mode_migration, date_migration } = req.body;
  pool.query(
    "INSERT INTO materiel (id, nature, date_entrer, date_fin, info, cout, etat, mode_migration, date_migration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [id, nature, date_entrer, date_fin, info, cout, etat, mode_migration, date_migration],
    (error, results) => {
      if (error) {
        
      }
      res.redirect(req.headers.referer);
    }
  );
});



app.post("/edit/:id", (req, res) => { 
  const { id } = req.params; 
  const { nature, date_entrer, date_fin, info, cout, etat, mode_migration, date_migration } = req.body; 
  pool.query( 
    "UPDATE materiel SET nature = $1, date_entrer = $2, date_fin = $3, info = $4, cout = $5, etat = $6, mode_migration = $7, date_migration = $8 WHERE id = $9", 
    [nature, date_entrer, date_fin, info, cout, etat, mode_migration, date_migration, id], 
    (error, results) => { 
      if (error) { 
        throw error; 
      } 
      res.redirect(req.headers.referer); 
    } 
  ); 
});




app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM materiel WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.redirect(req.headers.referer);
  });
});


app.get("/materiel", (req, res) => {
  pool.query("SELECT * FROM materiel ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    const materiel = results.rows;
    res.render("admin/materiel", { materiel: materiel });
  });
});



app.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { nom,datenaiss, sexe, tel, cni, service, email } = req.body;
  pool.query(
    "UPDATE patient SET nom = $1, datenaiss = $2, sexe = $3, tel = $4, cni = $5, service = $6, email= $7 WHERE id = $8",
    [nom, datenaiss, sexe, tel, cni, service, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect(req.headers.referer);
    }
  );
});


/// LE PERSONNEL



app.get("/personnel", async (req, res) => {
  try {
    const results = await pool.query("select * from personnel order by id asc");
    res.render("admin/personnel", {
      personnel: results.rows,
    });
  } catch (error) {
    throw error;
  }
});

app.post("/add2", (req, res) => {
  const { id, nom, direction, site, email } = req.body;
  pool.query(
    "INSERT INTO personnel (id, nom, direction, site, email) VALUES ($1, $2, $3, $4, $5)",
    [id, nom, direction, site, email],
    (error, results) => {
      if (error) {
        
      }
      res.redirect(req.headers.referer);
    }
  );
});

app.post("/edit2/:id", (req, res) => {
  const { id } = req.params;
  const {nom, direction, site, email } = req.body;
  pool.query(
    "UPDATE personnel SET nom = $1, direction = $2,site = $3,email = $4 WHERE id = $5",
    [nom, direction, site, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect(req.headers.referer);
    }
  );
});

app.post("/delete2/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM personnel WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.redirect(req.headers.referer);
  });
});


// EMPRUNT


app.get("/emprunt", async (req, res) => {
  try {
    const results = await pool.query("select * from emprunt order by date asc");

    const result = await pool.query("select nom from personnel"); //pour liste deroulante
    const personnel = result.rows.map((row) => row.nom); 

    const resulte = await pool.query("select nature from materiel"); //pour liste deroulante
    const materiel = resulte.rows.map((row) => row.nature); 
    

    res.render("admin/emprunt",{
      emprunt: results.rows,
      personnel: personnel,
      materiel: materiel,
    });
  } catch (error) {
    throw error;
  }
});

app.post("/add3", (req, res) => {
  const {nom, date, date_retour, motif ,materiel} = req.body;
  pool.query(
    "INSERT INTO emprunt (nom, date, date_retour, motif,materiel) VALUES ($1, $2, $3, $4,$5)",
    [nom, date, date_retour, motif, materiel],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect(req.headers.referer);
    }
  );
});

app.post("/delete3/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM emprunt WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.redirect(req.headers.referer);
  });
});

app.post("/edit3/:id", (req, res) => {
  const { id } = req.params;
  const {nom, date, date_retour, motif,materiel } = req.body;
  pool.query(
    "UPDATE emprunt SET nom = $1, date = $2,date_retour = $3,motif = $4,materiel=$5 WHERE id = $6",
    [nom, date, date_retour, motif,materiel, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect(req.headers.referer);
    }
  );
});




app.listen(5000, function () {
  console.log("Server started on port 5000");
});
