
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status?: "info" | "warning" | "success" | "error";
}

interface RecentActivitiesListProps {
  title: string;
  activities: Activity[];
}

const RecentActivitiesList = ({ title, activities }: RecentActivitiesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    {activity.status && (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full mt-1",
                          activity.status === "info" && "bg-blue-100 text-blue-800",
                          activity.status === "warning" && "bg-amber-100 text-amber-800",
                          activity.status === "success" && "bg-green-100 text-green-800",
                          activity.status === "error" && "bg-red-100 text-red-800"
                        )}
                      >
                        {activity.status === "info" && "Informação"}
                        {activity.status === "warning" && "Atenção"}
                        {activity.status === "success" && "Concluído"}
                        {activity.status === "error" && "Crítico"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Nenhuma atividade recente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesList;
