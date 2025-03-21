import { z } from "zod";

export const EventSchema = z.object({
  name: z.string({ required_error: "Event name is required" }),
  description: z.string({ required_error: "Event description is required" }),
  date: z.string({ required_error: "Event date is required" }), // Use `z.date()` if storing actual Date objects
  timeline: z
    .array(
      z.object({
        activity: z.string({ required_error: "Activity name is required" }),
        time: z.string({ required_error: "Activity time is required" }),
      })
    )
    .nonempty("Timeline must have at least one activity"),
  img: z.string({ required_error: "Event image URL is required" }), // Consider adding a URL validation
  venue: z.string({ required_error: "Event venue is required" }),
  theme: z.string({ required_error: "Event theme is required" }),
  maxParticipantsPerTeam: z
    .number({ required_error: "Max participants per team is required" })
    .int()
    .positive("Max participants per team must be a positive number"),
  prizes: z.array(
    z.object({
      position: z
        .number({ required_error: "Prize position is required" })
        .int()
        .positive("Position must be a positive number"),
      amount: z
        .number({ required_error: "Prize amount is required" })
        .nonnegative("Amount cannot be negative"),
    })
  ),
  rules: z.array(z.string()).nonempty("At least one rule is required"),
  coordinators: z
    .array(
      z.object({
        name: z.string({ required_error: "Coordinator name is required" }),
        contactNumber: z
          .string({ required_error: "Coordinator contact number is required" })
          .regex(/^\d{10}$/, "Invalid contact number"),
      })
    )
    .nonempty("At least one coordinator is required"),
  organizerId: z.string(),
  userId: z
    .string({ required_error: "User ID is required" })
    .min(1, "User ID is required"),
});

export type IEventSchema = z.infer<typeof EventSchema>;

export const updateEventSchema = z.object({
  name: z.string({ required_error: "Event name is required" }),
  description: z.string({ required_error: "Event description is required" }),
  date: z.string({ required_error: "Event date is required" }), // Use `z.date()` if storing actual Date objects
  timeline: z
    .array(
      z.object({
        activity: z.string({ required_error: "Activity name is required" }),
        time: z.string({ required_error: "Activity time is required" }),
      })
    )
    .nonempty("Timeline must have at least one activity"),
  img: z.string({ required_error: "Event image URL is required" }), // Consider adding a URL validation
  venue: z.string({ required_error: "Event venue is required" }),
  theme: z.string({ required_error: "Event theme is required" }),
  maxParticipantsPerTeam: z
    .number({ required_error: "Max participants per team is required" })
    .int()
    .positive("Max participants per team must be a positive number"),
  prizes: z.array(
    z.object({
      position: z
        .number({ required_error: "Prize position is required" })
        .int()
        .positive("Position must be a positive number"),
      amount: z
        .number({ required_error: "Prize amount is required" })
        .nonnegative("Amount cannot be negative"),
    })
  ),
  rules: z.array(z.string()).nonempty("At least one rule is required"),
  coordinators: z
    .array(
      z.object({
        name: z.string({ required_error: "Coordinator name is required" }),
        contactNumber: z
          .string({ required_error: "Coordinator contact number is required" })
          .regex(/^\d{10}$/, "Invalid contact number"),
      })
    )
    .nonempty("At least one coordinator is required"),
  userId: z
    .string({ required_error: "User ID is required" })
    .min(1, "User ID is required"),
});

export type IUpdateEventSchema = z.infer<typeof updateEventSchema>;