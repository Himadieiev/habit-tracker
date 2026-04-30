import {toast} from "sonner";

import {supabase} from "@/lib/supabaseClient";

export type HabitFromDB = {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
};

export type HabitWithLogsFromDB = {
  id: string;
  title: string;
  order: number;
  created_at: string;
  habit_logs:
    | {
        date: string;
        completed: boolean;
      }[]
    | null;
};

export const habitsService = {
  async getHabitsWithLogs(userId: string): Promise<HabitWithLogsFromDB[]> {
    const {data, error} = await supabase
      .from("habits")
      .select(
        `
      id,
      title,
      order,
      created_at,
      habit_logs (
        date,
        completed
      )
    `,
      )
      .eq("user_id", userId)
      .order("order", {ascending: true});

    if (error) {
      toast.error("Failed to load habits");
      console.error(error);
      return [];
    }

    return (data ?? []) as HabitWithLogsFromDB[];
  },

  async getHabitById(id: string): Promise<HabitWithLogsFromDB | null> {
    const {data, error} = await supabase
      .from("habits")
      .select(
        `
      id,
      title,
      order,
      created_at,  
      habit_logs (
        date,
        completed
      )
    `,
      )
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to load habit details");
      console.error("getHabitById error:", error);
      return null;
    }

    return data;
  },

  async addHabit(title: string, userId: string) {
    const {data: lastHabit} = await supabase
      .from("habits")
      .select("order")
      .eq("user_id", userId)
      .order("order", {ascending: false})
      .limit(1)
      .maybeSingle();

    const newOrder = (lastHabit?.order ?? -10) + 10;

    const {data, error} = await supabase
      .from("habits")
      .insert([
        {
          title,
          user_id: userId,
          order: newOrder,
        },
      ])
      .select("id, title, order, created_at")
      .single();

    if (error) {
      toast.error("Failed to add habit");
      console.error("addHabit error:", error);
      return null;
    }

    toast.success(`"${title}" habit added`);
    return data;
  },

  async deleteHabit(id: string) {
    const {error} = await supabase.from("habits").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete habit");
      console.error("deleteHabit error:", error);
      return false;
    }

    toast.success("Habit deleted");
    return true;
  },

  async getHabitLogForToday(habitId: string, date: string) {
    const {data, error} = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("date", date)
      .maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  },

  async toggleHabitLog(habitId: string) {
    const today = new Date().toISOString().slice(0, 10);

    const existing = await this.getHabitLogForToday(habitId, today);

    if (existing) {
      const {error} = await supabase.from("habit_logs").delete().eq("id", existing.id);

      if (error) {
        toast.error("Failed to mark habit as incomplete");
        console.error(error);
        return false;
      }

      toast.success("Habit marked as incomplete");
      return true;
    }

    const {error} = await supabase.from("habit_logs").insert([
      {
        habit_id: habitId,
        date: today,
        completed: true,
      },
    ]);

    if (error) {
      toast.error("Failed to mark habit as complete");
      console.error(error);
      return false;
    }

    toast.success("Habit marked as complete");
    return true;
  },

  async toggleHabitLogByDate(habitId: string, date: string) {
    const {data: existing, error: fetchError} = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", habitId)
      .eq("date", date)
      .maybeSingle();

    if (fetchError) {
      toast.error("Failed to update habit");
      console.error(fetchError);
      return false;
    }

    if (existing) {
      const {error} = await supabase.from("habit_logs").delete().eq("id", existing.id);

      if (error) {
        toast.error("Failed to mark day as incomplete");
        console.error(error);
        return false;
      }

      toast.success("Day marked as incomplete");
      return true;
    }

    const {error} = await supabase.from("habit_logs").insert([
      {
        habit_id: habitId,
        date,
        completed: true,
      },
    ]);

    if (error) {
      toast.error("Failed to mark day as complete");
      console.error(error);
      return false;
    }

    toast.success("Day marked as complete");
    return true;
  },

  async updateHabitTitle(id: string, title: string) {
    const {error} = await supabase.from("habits").update({title}).eq("id", id);

    if (error) {
      toast.error("Failed to update habit title");
      console.error(error);
      return false;
    }

    toast.success("Habit title updated");
    return true;
  },

  async updateHabitsOrder(updates: {id: string; order: number}[]) {
    const queries = updates.map((u) =>
      supabase.from("habits").update({order: u.order}).eq("id", u.id),
    );

    const results = await Promise.all(queries);

    results.forEach(({error}) => {
      if (error) {
        toast.error("Failed to reorder habits");
        console.error(error);
      }
    });
  },
};
