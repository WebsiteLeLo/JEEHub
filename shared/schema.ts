import { z } from "zod";

// Task Schema
export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Task title is required"),
  subject: z.enum(["Physics", "Chemistry", "Mathematics"]),
  description: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["pending", "in-progress", "completed", "overdue"]),
  dueDate: z.string(),
  createdAt: z.string(),
  completedAt: z.string().optional(),
  estimatedTime: z.number().optional(), // in minutes
  actualTime: z.number().optional(), // in minutes
});

export const insertTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  completedAt: true,
  status: true,
});

// Resource Schema
export const resourceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Resource title is required"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
  subject: z.enum(["Physics", "Chemistry", "Mathematics", "General"]),
  category: z.enum(["video", "book", "pdf", "website", "tool"]),
  createdAt: z.string(),
});

export const insertResourceSchema = resourceSchema.omit({
  id: true,
  createdAt: true,
});

// Study Session Schema
export const studySessionSchema = z.object({
  id: z.string(),
  subject: z.enum(["Physics", "Chemistry", "Mathematics"]),
  duration: z.number(), // in minutes
  startTime: z.string(),
  endTime: z.string(),
  taskId: z.string().optional(),
  notes: z.string().optional(),
});

export const insertStudySessionSchema = studySessionSchema.omit({
  id: true,
});

// Schedule Item Schema
export const scheduleItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Schedule item title is required"),
  subject: z.enum(["Physics", "Chemistry", "Mathematics"]),
  startTime: z.string(),
  endTime: z.string(),
  date: z.string(),
  type: z.enum(["study", "test", "revision", "break"]),
  completed: z.boolean().default(false),
});

export const insertScheduleItemSchema = scheduleItemSchema.omit({
  id: true,
  completed: true,
});

// Activity Schema
export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(["task_completed", "study_session", "task_created", "resource_added"]),
  description: z.string(),
  subject: z.enum(["Physics", "Chemistry", "Mathematics"]).optional(),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

// User Stats Schema
export const userStatsSchema = z.object({
  totalTasks: z.number().default(0),
  completedTasks: z.number().default(0),
  totalStudyTime: z.number().default(0), // in minutes
  currentStreak: z.number().default(0),
  lastStudyDate: z.string().optional(),
  subjectProgress: z.object({
    Physics: z.number().default(0),
    Chemistry: z.number().default(0),
    Mathematics: z.number().default(0),
  }).default({
    Physics: 0,
    Chemistry: 0,
    Mathematics: 0,
  }),
});

// Export types
export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type StudySession = z.infer<typeof studySessionSchema>;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type UserStats = z.infer<typeof userStatsSchema>;

// Subject type
export type Subject = "Physics" | "Chemistry" | "Mathematics";
