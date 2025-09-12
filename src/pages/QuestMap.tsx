import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuestMap } from "@/components/quest/QuestMap";
import { TopNavbar } from "@/components/navigation/TopNavbar";

interface Quest {
  id: string;
  title: string;
  description: string;
  quest_type: string;
  difficulty: number;
  location: string;
  is_active: boolean;
  created_at: string;
}

const QuestMapPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const { data, error } = await supabase
          .from("Quests")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setQuests(data || []);
      } catch (error) {
        console.error("Error fetching quests:", error);
        toast({
          title: "Error",
          description: "Failed to load quests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <TopNavbar />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-4">
            Quest Map
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exciting quests in your area and plan your next adventure.
          </p>
        </div>

        {/* Quest Map */}
        {loading ? (
          <div className="flex items-center justify-center h-96 bg-gradient-to-br from-background to-accent/5 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-background to-accent/5 rounded-2xl p-1 shadow-xl">
            <QuestMap quests={quests} />
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestMapPage;