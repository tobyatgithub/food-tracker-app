import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

var requireAuth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWK_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

const PORT = parseInt(process.env.PORT) || 8000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// get all users
app.get("/foodtracks/allUsers", async (req, res) => {
  const trackUsers = await prisma.user
    .findMany({ where: {} })
    .catch(res.status(404).send(`failed to fetch users`));
  res.json(trackUsers);
});

// get info of a specific user
app.get("/foodtracks/user/:auth0Id", async (req, res) => {
  const auth0Id = "auth0|" + req.params.auth0Id.replace(":", "");
  console.log(auth0Id);

  // if (!!auth0Id) {
  const user = await prisma.user.findMany({
    where: {
      auth0Id,
    },
  });
  res.json(user);
  // }
});

// get all tracks from a particular user
app.get("/foodtracks", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  // console.log(auth0Id);
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const posts = await prisma.foodTrack.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
  });
  res.json(posts);
});

// creates a track item
app.post("/foodtracks", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;

  const { productName, shopDate, store, price, discounted } = req.body;
  if (!productName) {
    res.status(400).send("Product Name is required");
  } else {
    const foodTrack = await prisma.foodTrack.create({
      data: {
        productName,
        shopDate,
        store,
        price,
        discounted,
        user: { connect: { auth0Id } },
      },
    });
    res.json(foodTrack);
  }
});

// deletes a track item by id
app.delete("/foodtracks/:id", requireAuth, async (req, res) => {
  try {
    const foodTrack = await prisma.foodTrack.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(foodTrack);
  } catch {
    res.status(404).send(`Post id ${req.params.id} not found`);
  }
});

// get a specific track item by id
app.get("/foodtracks/:id", requireAuth, async (req, res) => {
  try {
    const foodTrack = await prisma.foodTrack.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (foodTrack) {
      res.json(foodTrack);
    } else {
      res.status(404).send(`Post id ${req.params.id} not found`);
    }
  } catch (error) {
    res.status(404).send(`Post id ${req.params.id} not found`);
  }
});

// updates a track item by id
app.put("/foodtracks/:recordId", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const {
    productName,
    shopDate,
    price,
    store,
    // userId: id,
    discounted,
    quantity,
    category,
    unitPrice,
  } = req.body;
  try {
    const updateFoodTrack = await prisma.foodTrack.update({
      where: {
        id: parseInt(req.params.recordId),
      },
      data: {
        productName: productName,
        shopDate: shopDate,
        price: parseFloat(price),
        store: store,
        discounted: discounted === "true",
        quantity: quantity || "",
        category: category || "",
        unitPrice: unitPrice || "",
        // user: { connect: { id } },
        user: { connect: { auth0Id } },
      },
    });
    res.json(updateFoodTrack);
  } catch {
    res.status(404).send(`Update failed for id ${req.params.id} with error: `);
  }
});

app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const email = req.user[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.user[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        nickName: name,
      },
    });

    res.json(newUser);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
