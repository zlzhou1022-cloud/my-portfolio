export interface Photo {
  src: string;
  desc: string; // 目前是中文，下一步我们会把它升级成多语种对象
}

export interface Trip {
  id: string;
  date: string; 
  title: string;
  cover: string;
  photos: Photo[];
}

// 💡 架构优化：辅助函数。只需传入文件名，自动拼接完整的云端绝对路径
const getImageUrl = (path: string) => `https://xvwjtmycuaplxmtgwkok.supabase.co/storage/v1/object/public/travels/${path}`;

const trips: Trip[] = [
  {
    id: "tohoku-feb-2026", // URL 的后缀
    date: "2026-02-23",
    title: "日本东北地方纪行：雪与祭典",
    // 假设你的封面图叫 cover.webp，放在 tohoku 文件夹下
    cover: getImageUrl("tohoku2026Feb/appleshrine.jpg"), 
    photos: [
      { 
        src: getImageUrl("tohoku2026Feb/appleshrine.jpg"), 
        desc: "青森县青森市，广田神社（苹果神社）的手水舍" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/stationstuff.jpg"), 
        desc: "青森县弘前市，站台上的弘南铁道站员" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/afactory.jpg"), 
        desc: "青森县青森市，A-factory前的广场" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/nebuta.jpg"), 
        desc: "青森县青森市，睡魔节之家展览馆的睡魔面部" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/tazawako.jpg"), 
        desc: "秋田县仙北市，田泽湖旁的辰子像" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/namahageentry.jpg"), 
        desc: "秋田县男鹿市，生剥鬼柴灯祭，扮演生剥鬼的年轻人们手持火把下山" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/namahagebudai.jpg"), 
        desc: "秋田县男鹿市，生剥鬼柴灯祭，演员在舞台上表演" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/kamakurasaikishi.jpg"), 
        desc: "秋田县横手市，雪屋祭，从桥上俯瞰河岸边的小雪屋" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/kamakurasaiyoru.jpg"), 
        desc: "秋田县横手市，雪屋祭，夜晚在河岸边的小雪屋里点起了蜡烛" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/moriokahachiman.jpg"), 
        desc: "岩手县盛冈市，盛冈八幡宫" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/moriokareimen.jpg"), 
        desc: "岩手县盛冈市，盛楼阁的盛冈冷面" 
      },
      { 
        src: getImageUrl("tohoku2026Feb/wanko.jpg"), 
        desc: "岩手县盛冈市，吃完100碗以上wanko荞麦面会获赠一个纪念木牌" 
      },
      
      // ... 你可以无限往下加，只需要填入对应的文件名和文字说明
    ]
  },
  // 等你五月份去完大分，就可以在这里直接 copy 一个新对象：
  // { id: "oita-may-2026", title: "九州大分：初夏", ... }
];

export const getAllTrips = () => {
  return [...trips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getTripById = (id: string) => trips.find(t => t.id === id);