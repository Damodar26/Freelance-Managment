import { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "@/lib/dbConnect"
import Project from "@/models/Project"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect() // Ensure database is connected

  if (req.method === "GET") {
    try {
      const projects = await Project.find({ status: "active" }).populate("members", "username email")

      const formattedProjects = projects.map((project) => ({
        id: project._id.toString(),
        name: project.name,
        deadline: project.deadline?.toISOString() || "",
        tasks: project.tasks.length.toString(),
        progress: project.totalHoursWorked,
        team: project.members.map((member) => member.username),
        status: project.status,
      }))

      res.status(200).json(formattedProjects)
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve projects", error: error.message })
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
