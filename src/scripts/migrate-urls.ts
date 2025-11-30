import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post';
import Event from '../models/Event';
import User from '../models/User';

dotenv.config();

const migrateUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    const baseURL = 'https://northeasternconnect-backend.onrender.com';

    // Update Posts
    const posts = await Post.find({});
    for (const post of posts) {
      let updated = false;
      if (post.imageUrl?.includes('localhost')) {
        post.imageUrl = post.imageUrl.replace('http://localhost:5000', baseURL);
        updated = true;
      }
      if (post.images) {
        post.images = post.images.map(img => img.replace('http://localhost:5000', baseURL));
        updated = true;
      }
      if (updated) await post.save();
    }

    // Update Events
    const events = await Event.find({});
    for (const event of events) {
      let updated = false;
      if (event.imageUrl?.includes('localhost')) {
        event.imageUrl = event.imageUrl.replace('http://localhost:5000', baseURL);
        updated = true;
      }
      if (event.images) {
        event.images = event.images.map(img => img.replace('http://localhost:5000', baseURL));
        updated = true;
      }
      if (updated) await event.save();
    }

    // Update Users
    const users = await User.find({});
    for (const user of users) {
      if (user.profilePicture?.includes('localhost')) {
        user.profilePicture = user.profilePicture.replace('http://localhost:5000', baseURL);
        await user.save();
      }
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUrls();