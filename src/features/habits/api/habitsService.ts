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
      habit_logs (
        date,
        completed
      )
    `,
      )
      .eq("user_id", userId)
      .order("order", {ascending: true});

    if (error) {
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
      habit_logs (
        date,
        completed
      )
    `,
      )
      .eq("id", id)
      .single();

    if (error) {
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
      .select("id, title, order")
      .single();

    if (error) {
      console.error("addHabit error:", error);
      return null;
    }

    return data;
  },

  async deleteHabit(id: string) {
    const {error} = await supabase.from("habits").delete().eq("id", id);

    if (error) {
      console.error("deleteHabit error:", error);
      return false;
    }

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
        console.error(error);
        return false;
      }

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
      console.error(error);
      return false;
    }

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
      console.error(fetchError);
      return false;
    }

    if (existing) {
      const {error} = await supabase.from("habit_logs").delete().eq("id", existing.id);

      if (error) {
        console.error(error);
        return false;
      }

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
      console.error(error);
      return false;
    }

    return true;
  },

  async updateHabitTitle(id: string, title: string) {
    const {error} = await supabase.from("habits").update({title}).eq("id", id);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  },

  async updateHabitsOrder(updates: {id: string; order: number}[]) {
    const queries = updates.map((u) =>
      supabase.from("habits").update({order: u.order}).eq("id", u.id),
    );

    const results = await Promise.all(queries);

    results.forEach(({error}) => {
      if (error) console.error(error);
    });
  },
};
