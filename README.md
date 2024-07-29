🌐 Live Demo

Explore the live demonstration of the project: https://imaginify-two-weld.vercel.app/

📝 Description

Imaginify is Image editing Ai Saas application built using Next.Js 14, Typescript, Tailwind Css, ShadCn, MongoDb, Clerk, Stripe.The app bascically provides various features like background removal, image color change , removing object from image, changing aspect ratio, etc. This features are bascically incorporated by integrating Cloudinary Ai with the app. The app also supports payment gateway to buy to tokens with the help of Stripe.

✨ Technologies Used

Imaginify is built using the following technologies:

[![My Skills](https://skillicons.dev/icons?i=nextjs,ts,tailwind,mongodb)](https://skillicons.dev)
🧰 Get Started

To get this project up and running in your development environment, follow these step-by-step instructions.

Prerequisites:

In order to install and run this project locally, you would need to have the following installed on your local machine.

Node.js 

NPM 

Git

⚙️ Installation and Run Locally

Step 0:

Note ‼️ the application uses Clerk for Authentication and User Management, therefore, you need to create Clerk account here and sets the CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY environment variables in .env file.

Note ‼️ the application uses Mongo Db as database, therefore, you need to create Mongo DB atlas account.

Step 1:

Download or clone this repo by using the link below:

git clone https://github.com/sandeepdev777/Imaginify.git

step 2:

Execute the following command in the root directory of the downloaded repo in order to install dependencies:

npm install

Step 3:

Execute the following command in order to run the development server locally:

npm run dev

Step 4:

Open http://localhost:3000 with your browser to see the result.

🔒 Environment Variables

Environment variables can be used for configuration. They must be set before running the app.

Environment variables are variables that are set in the operating system or shell, typically used to configure programs.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
