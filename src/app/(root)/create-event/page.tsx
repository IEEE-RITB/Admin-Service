"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react"

interface TimelineEntry {
  activity: string;
  time: string;
}

interface PrizeEntry {
  position: number;
  amount: number;
}

interface CoordinatorEntry {
  name: string;
  contactNumber: string;
}

interface EventFormData {
  userId: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  theme: string;
  maxParticipantsPerTeam: number;
  img: string;
  timeline: TimelineEntry[];
  prizes: PrizeEntry[];
  rules: string[];
  coordinators: CoordinatorEntry[];
}

export default function CreateEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>({
    userId: session?.user?.id || "",
    name: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    venue: "",
    theme: "",
    maxParticipantsPerTeam: 4,
    img: "https://images.unsplash.com/photo-1726137065566-153debe32a53?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    timeline: [{ activity: "", time: "" }],
    prizes: [{ position: 1, amount: 0 }],
    rules: [""],
    coordinators: [{ name: "", contactNumber: "" }],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("user id form client side: ", session?.user?.id)
      const response = await axios.post("/api/create-event", {
        ...formData,
        userId: session?.user?.id, // Assign userId dynamically
      });
      router.push("/");
      console.log("Event created successfully:", response.data);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Dynamic section update handlers
  const addTimelineEntry = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { activity: "", time: "" }],
    }));
  };

  const updateTimelineEntry = (index: number, field: keyof TimelineEntry, value: string) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData((prev) => ({ ...prev, timeline: newTimeline }));
  };

  const removeTimelineEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const addPrizeEntry = () => {
    setFormData((prev) => ({
      ...prev,
      prizes: [...prev.prizes, { position: prev.prizes.length + 1, amount: 0 }],
    }));
  };

  const updatePrizeEntry = (index: number, field: keyof PrizeEntry, value: string) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = field === 'position' ? parseInt(value) : Number(value);
    setFormData((prev) => ({ ...prev, prizes: newPrizes }));
  };

  const removePrizeEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));
  };

  const addRuleEntry = () => {
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, ""],
    }));
  };

  const updateRuleEntry = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData((prev) => ({ ...prev, rules: newRules }));
  };

  const removeRuleEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const addCoordinatorEntry = () => {
    setFormData((prev) => ({
      ...prev,
      coordinators: [...prev.coordinators, { name: "", contactNumber: "" }],
    }));
  };

  const updateCoordinatorEntry = (index: number, field: keyof CoordinatorEntry, value: string) => {
    const newCoordinators = [...formData.coordinators];
    newCoordinators[index][field] = value;
    setFormData((prev) => ({ ...prev, coordinators: newCoordinators }));
  };

  const removeCoordinatorEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      coordinators: prev.coordinators.filter((_, i) => i !== index),
    }));
  };

  if (status === "loading") return <div>Loading...</div>

  return (
    <div className="container py-10 max-w-4xl">
      <Card className="border shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-2xl">Create Event</CardTitle>
          <CardDescription>Fill in the details to create a new event</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <Separator />
              <Input
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Textarea
                name="description"
                placeholder="Describe your event"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <Input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <Input
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />
              <Input
                name="theme"
                placeholder="Theme"
                value={formData.theme}
                onChange={handleChange}
              />
              <Input
                type="number"
                name="maxParticipantsPerTeam"
                placeholder="Max Participants per Team"
                value={formData.maxParticipantsPerTeam}
                onChange={handleChange}
                required
                min={1}
              />
              <Input
                name="img"
                placeholder="Image URL"
                value={formData.img}
                onChange={handleChange}
              />
            </div>

            {/* Timeline Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Event Timeline</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimelineEntry}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Timeline Entry
                </Button>
              </div>
              <Separator />
              {formData.timeline.map((entry, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="Activity"
                    value={entry.activity}
                    onChange={(e) => updateTimelineEntry(index, 'activity', e.target.value)}
                    required
                  />
                  <Input
                    type="time"
                    value={entry.time}
                    onChange={(e) => updateTimelineEntry(index, 'time', e.target.value)}
                    required
                  />
                  {formData.timeline.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeTimelineEntry(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Prizes Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Prizes</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPrizeEntry}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Prize
                </Button>
              </div>
              <Separator />
              {formData.prizes.map((prize, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Position"
                    value={prize.position}
                    onChange={(e) => updatePrizeEntry(index, 'position', e.target.value)}
                    required
                    min={1}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={prize.amount}
                    onChange={(e) => updatePrizeEntry(index, 'amount', e.target.value)}
                    required
                    min={0}
                  />
                  {formData.prizes.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removePrizeEntry(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Rules Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Event Rules</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRuleEntry}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
                </Button>
              </div>
              <Separator />
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="Rule description"
                    value={rule}
                    onChange={(e) => updateRuleEntry(index, e.target.value)}
                    required
                  />
                  {formData.rules.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeRuleEntry(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Coordinators Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Event Coordinators</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCoordinatorEntry}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Coordinator
                </Button>
              </div>
              <Separator />
              {formData.coordinators.map((coordinator, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="Coordinator Name"
                    value={coordinator.name}
                    onChange={(e) => updateCoordinatorEntry(index, 'name', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Contact Number"
                    value={coordinator.contactNumber}
                    onChange={(e) => updateCoordinatorEntry(index, 'contactNumber', e.target.value)}
                    required
                  />
                  {formData.coordinators.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeCoordinatorEntry(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">Create Event</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}