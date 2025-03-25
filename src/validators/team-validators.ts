import { z } from "zod";

export const TeamSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  leader: z.object({
    name: z.string().min(1, "Leader's name is required"),
    email: z.string().email("Invalid email format"),
    contactNumber: z.string().min(10, "Invalid contact number"),
    usn: z.string().optional(),
  }),
  members: z.array(
    z.object({
      name: z.string().min(1, "Member name is required"),
      usn: z.string().optional(),
    })
  ),
  event: z.string().min(1, "Event ID is required"), // Should be validated as MongoDB ObjectId separately
});

export type ITeamSchema = z.infer<typeof TeamSchema>;
