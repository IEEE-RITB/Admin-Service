import { NextResponse } from "next/server";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { teamsCollection } from "@/storage";

// Define Team Interface
interface Team {
  teamName: string;
  leader: {
    name: string;
    email: string;
  };
  members: { name: string }[];
  registeredAt: Date;
  event?: {
    name: string;
  };
}

// Define Grouped Teams Type
type GroupedTeams = Record<string, Omit<Team, "event">[]>;

export async function GET() {
  try {
    const teams: Team[] = await teamsCollection
      .aggregate<Team>([
        {
          $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event",
          },
        },
        { $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    if (teams.length === 0) {
      return NextResponse.json({
        status: 404,
        message: "No registered teams found",
      });
    }

    // Group teams by event name
    const groupedTeams: GroupedTeams = {};
    teams.forEach((team) => {
      const eventName = team.event?.name || "Unknown_Event";
      if (!groupedTeams[eventName]) {
        groupedTeams[eventName] = [];
      }
      groupedTeams[eventName].push({
        teamName: team.teamName,
        leader: {
          name: team.leader.name,
          email: team.leader.email,
        },
        members: team.members,
        registeredAt: new Date(team.registeredAt),
      });
    });

    // Create Excel workbook
    const workbook = xlsx.utils.book_new();
    for (const [event, teams] of Object.entries(groupedTeams)) {
      const worksheet = xlsx.utils.json_to_sheet(
        teams.map((t) => ({
          Team_Name: t.teamName,
          Leader_Name: t.leader.name,
          Leader_Email: t.leader.email,
          Member_Names: t.members.map((m) => m.name).join(", "),
          Registered_At: t.registeredAt.toISOString(),
        }))
      );
      xlsx.utils.book_append_sheet(workbook, worksheet, event.substring(0, 31));
    }

    // Define file path
    const exportDir = path.join(process.cwd(), "public", "exports");
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const filePath = path.join(exportDir, "registered_teams.xlsx");
    xlsx.writeFile(workbook, filePath);

    return NextResponse.json({
      status: 200,
      message: "Excel file generated successfully",
      fileUrl: `/exports/registered_teams.xlsx`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Server error",
      error: (error as Error).message,
    });
  }
}
