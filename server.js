//=====imports==================
import express from "express";
import pg from "pg";
import dotenv from "dotenv";

//======set up =================
dotenv.config();
const app = express();
const PORT = 7504;
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

//======middleware==============
app.use(express.static("public"));
app.use(express.json());

//=====routs====================
//
/*===get route===*/
app.get("/tododb/to_do_list", (req, res) => {
  db.query("SELECT * FROM to_do_list")
    .then((data) => {
      res.status(200).send(data.rows);
    })
    .catch((err) => {
      console.error("failed to retrive to do list:", err);
      res.sendStatus(500);
    });
});

/*===get route===*/
app.get("/tododb/user_data", (req, res) => {
  const { userName } = req.query;

  db.query(`SELECT id FROM user_data WHERE name = $1`, [userName])
    .then((data) => {
      res.status(200).send(data.rows[0]);
    })
    .catch((err) => {
      console.error("failed to retrieve user id:", err);
      res.sendStatus(500);
    });
});

/*===post route===*/
app.post("/tododb/to_do_list", (req, res) => {
  const { task, description, urgent, completed, user_id } = req.body;

  db.query(
    "INSERT INTO to_do_list (task, description, urgent, completed, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [task, description, urgent, completed, user_id]
  )
    .then((data) => {
      const newItem = data.rows[0];
      res.status(201).send(newItem);
    })
    .catch((err) => {
      console.error("Error creating new to-do item:", err);
      res.sendStatus(500);
    });
});
/*===post route===*/
app.post("/tododb/user_data", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO user_data (name) VALUES ($1) RETURNING *", [name])
    .then((data) => {
      const newUser = data.rows[0];
      res.status(201).send(newUser);
    })
    .catch((err) => {
      console.error("Error creating new user:", err);
      res.sendStatus(500);
    });
});
/*===PATCH route===*/
app.patch("/tododb/to_do_list/:id", (req, res) => {
  const { id } = req.params;
  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }
  const { task, description, urgent, completed } = req.body;

  const updateQuery = [];
  const queryParams = [];

  if (task) {
    queryParams.push(task);
    updateQuery.push(`task = $${queryParams.length}`);
  }

  if (description) {
    queryParams.push(description);
    updateQuery.push(`description = $${queryParams.length}`);
  }

  if (typeof urgent === "boolean") {
    queryParams.push(urgent);
    updateQuery.push(`urgent = $${queryParams.length}`);
  }

  if (typeof completed === "boolean") {
    queryParams.push(completed);
    updateQuery.push(`completed = $${queryParams.length}`);
  }

  // Add the ID parameter at the end
  queryParams.push(id);

  // Construct the final update query string with parameterized query
  const updateQueryString = `UPDATE to_do_list SET ${updateQuery.join(
    ", "
  )} WHERE ID = $${queryParams.length} RETURNING *`;
  console.log(updateQuery, queryParams, updateQueryString);
  // Execute the update query
  db.query(updateQueryString, queryParams)
    .then((data) => {
      res.json(data.rows[0]);
    })
    .catch((err) => {
      console.error("Error updating to-do item:", err);
      res.sendStatus(500);
    });
});

/*===delete route===*/
app.delete("/tododb/to_do_list/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM to_do_list WHERE id = $1 RETURNING *", [id])
    .then(() => {
      res.sendStatus(204).send(data.rows[0]);
    })
    .catch((err) => {
      console.error("Error deleting to-do item:", err);
      res.sendStatus(500);
    });
});

//=====listen===================
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
