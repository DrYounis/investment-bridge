export interface NikeRunStats {
    totalDistance: number;
    activeParticipants: number;
    averagePace: string;
    caloriesBurned: number;
    weeklyProgress: { day: string; distance: number }[];
    demographics: { ageGroup: string; percentage: number }[];
    topRunner: { name: string; distance: number };
}

export const getNikeRunStats = async (): Promise<NikeRunStats> => {
    // Mimicking local API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        totalDistance: 12450.5, // Total km for Hail Marathon 2026 participants
        activeParticipants: 842,
        averagePace: "5:42",
        caloriesBurned: 752300,
        weeklyProgress: [
            { day: "الأحد", distance: 1200 },
            { day: "الاثنين", distance: 1540 },
            { day: "الثلاثاء", distance: 1320 },
            { day: "الأربعاء", distance: 1890 },
            { day: "الخميس", distance: 2100 },
            { day: "الجمعة", distance: 2500 },
            { day: "السبت", distance: 1900 },
        ],
        demographics: [
            { ageGroup: "18-24", percentage: 25 },
            { ageGroup: "25-34", percentage: 40 },
            { ageGroup: "35-44", percentage: 20 },
            { ageGroup: "45+", percentage: 15 },
        ],
        topRunner: {
            name: "سعد الشمري",
            distance: 42.195
        }
    };
};
