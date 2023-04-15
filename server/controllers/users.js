import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw new Error ("User not found")
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // check if id and friendId are the same
    if (id === friendId) {
      res.status(400).json({ message: "Cannot add yourself as a friend" });
      return;
    }

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      throw new Error("Search term is required");
    }

    const searchTermArray = searchTerm.trim().split(" ");
    let firstNameRegex, lastNameRegex;

    if (searchTermArray.length === 1) {
      firstNameRegex = new RegExp(`^${searchTermArray[0]}`, "i");
      lastNameRegex = new RegExp(`^${searchTermArray[0]}`, "i");
    } else if (searchTermArray.length === 2) {
      firstNameRegex = new RegExp(`^${searchTermArray[0]}`, "i");
      lastNameRegex = new RegExp(`^${searchTermArray[1]}`, "i");
    } else {
      throw new Error("Invalid search term format");
    }

    const query = searchTermArray.length === 1
      ? {
          $or: [
            { firstName: { $regex: firstNameRegex } },
            { lastName: { $regex: lastNameRegex } },
          ],
        }
      : {
          $and: [
            { firstName: { $regex: firstNameRegex } },
            { lastName: { $regex: lastNameRegex } },
          ],
        };

    const users = await User.find(query);

    if (users.length === 0) {
      return res.status(200).json({ message: "No user with that name." });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
