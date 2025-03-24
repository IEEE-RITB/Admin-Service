"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSchema, type IEventSchema } from "@/validators/event-validators";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<IEventSchema>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      userId: "67ddb0d8259f13d1ad4a6e75",
      name: "",
      description: "",
      date: new Date().toISOString().slice(0, 16),
      venue: "",
      theme: "",
      maxParticipantsPerTeam: 4,
      img: "https://images.unsplash.com/photo-1726137065566-153debe32a53?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      timeline: [{ activity: "", time: "" }],
      organizerId: "67dd699539ccce92cace749c",
      prizes: [{ position: 1, amount: 0 }],
      rules: [""],
      coordinators: [{ name: "", contactNumber: "" }],
    },
  });

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
    control: form.control,
    name: "timeline",
  });

  const { fields: prizeFields, append: appendPrize, remove: removePrize } = useFieldArray({
    control: form.control,
    name: "prizes",
  });

  const { fields: ruleFields, append: appendRule, remove: removeRule } = useFieldArray({
    control: form.control,
    name: "rules",
  }) as unknown as {
    fields: { id: string }[];
    append: (value: string) => void;
    remove: (index: number) => void;
  };

  const { fields: coordinatorFields, append: appendCoordinator, remove: removeCoordinator } = useFieldArray({
    control: form.control,
    name: "coordinators",
  });

  return (
    <div className="container py-10 max-w-4xl ">
      <Card className="border shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-2xl">Create Event</CardTitle>
          <CardDescription>Fill in the details to create a new event</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Form values:', form.getValues());
            }} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your event" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Event location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <FormControl>
                          <Input placeholder="Event theme" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxParticipantsPerTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Participants Per Team</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="Enter maximum participants" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image that represents your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Accordion for additional sections */}
              <Accordion type="single" collapsible className="w-full">
                {/* Timeline Section */}
                <AccordionItem value="timeline">
                  <AccordionTrigger className="text-lg font-medium">
                    Event Timeline
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    {timelineFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`timeline.${index}.activity`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Activity</FormLabel>
                              <FormControl>
                                <Input placeholder="Activity name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`timeline.${index}.time`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTimeline(index)}
                          className="h-10 w-10 rounded-full"
                          disabled={timelineFields.length === 1}
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendTimeline({ activity: "", time: "" })}
                      className="mt-2 w-full"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Timeline Item
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Prizes Section */}
                <AccordionItem value="prizes">
                  <AccordionTrigger className="text-lg font-medium">
                    Prizes
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    {prizeFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`prizes.${index}.position`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Position</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`prizes.${index}.amount`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  step="100" 
                                  placeholder="Prize amount" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePrize(index)}
                          className="h-10 w-10 rounded-full"
                          disabled={prizeFields.length === 1}
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendPrize({ position: prizeFields.length + 1, amount: 0 })}
                      className="mt-2 w-full"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Prize
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Rules Section */}
                <AccordionItem value="rules">
                  <AccordionTrigger className="text-lg font-medium">
                    Rules
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    {ruleFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`rules.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Rule {index + 1}</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter rule" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRule(index)}
                          className="h-10 w-10 rounded-full"
                          disabled={ruleFields.length === 1}
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendRule("")}
                      className="mt-2 w-full"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Rule
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                {/* Coordinators Section */}
                <AccordionItem value="coordinators">
                  <AccordionTrigger className="text-lg font-medium">
                    Coordinators
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    {coordinatorFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`coordinators.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Coordinator name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`coordinators.${index}.contactNumber`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Contact Number</FormLabel>
                              <FormControl>
                                <Input placeholder="10-digit number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCoordinator(index)}
                          className="h-10 w-10 rounded-full"
                          disabled={coordinatorFields.length === 1}
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendCoordinator({ name: "", contactNumber: "" })}
                      className="mt-2 w-full"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Coordinator
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Submit Button in Card Footer */}
              <div className="pt-4">
                <Button type="submit" className="w-full">Create Event</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}