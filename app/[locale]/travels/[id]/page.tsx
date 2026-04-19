import { getTripById } from "@/lib/travel-data";
import { TravelPagination } from "@/components/travel-pagination";
import { ImageViewer } from "@/components/image-viewer"; 
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
// 💡 1. 引入我们刚写好的平滑滚动组件
import { ScrollLink } from "@/components/scroll-link";

export default async function TripDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string, locale: string }>,
  searchParams: Promise<{ p?: string }> 
}) {
  const { id } = await params;
  const { p } = await searchParams;
  
  const trip = getTripById(id);
  if (!trip) notFound();

  const t = await getTranslations("TripDetail");
  const tTrips = await getTranslations("Trips");

  const currentPage = parseInt(p || "1");
  const totalPage = trip.photos.length;
  const currentPhoto = trip.photos[currentPage - 1];

  if (!currentPhoto) notFound();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 mt-8 pb-20">
      <div className="mb-6 px-4 lg:px-0">
        <Link href="/travels" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("back")}
        </Link>
      </div>

      {/* 💡 手机端默认堆叠，电脑端分为左右两列 */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 px-4 lg:px-0">
        
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24 bg-white dark:bg-slate-900 lg:border border-slate-200 dark:border-slate-800 rounded-2xl lg:p-5 lg:shadow-sm lg:max-h-[70vh] flex flex-col transition-colors">
            
            <div className="mb-4 lg:pb-4 lg:border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl lg:text-lg font-bold text-slate-900 dark:text-slate-100">{tTrips(`${id}.title`)}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono tracking-wider">
                {trip.date} • {totalPage} {t("photos")}
              </p>
            </div>
            
            {/* 💡 核心魔术区：手机端 flex-row 横滑，电脑端 flex-col 纵滑 */}
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto lg:pr-2 gap-3 lg:gap-0 lg:space-y-1 pb-2 lg:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
              {trip.photos.map((_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === currentPage;
                return (
                  // 💡 2. 使用 ScrollLink 代替原生 Link
                  <ScrollLink 
                    key={pageNum} 
                    href={`/travels/${id}?p=${pageNum}`} 
                    // 💡 手机端变成固定宽度 (w-48) 的小卡片，防挤压 (shrink-0)
                    className={`snap-start shrink-0 w-48 lg:w-full block px-4 py-3 lg:px-3 lg:py-2.5 rounded-xl lg:rounded-lg text-sm transition-all border lg:border-transparent ${
                      isActive 
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold border-slate-900 dark:border-slate-100" 
                        : "bg-slate-50 lg:bg-transparent dark:bg-slate-800/50 lg:dark:bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row gap-1 lg:gap-2">
                      <span className="shrink-0 font-mono text-xs lg:text-sm opacity-70 lg:opacity-100">P{pageNum}</span>
                      <span className="line-clamp-2">{tTrips(`${id}.photos.${pageNum}`)}</span>
                    </div>
                  </ScrollLink>
                );
              })}
            </div>
          </div>
        </aside>

        {/* 💡 3. 加入 id="photo-viewer" 和 scroll-mt-24 防遮挡 */}
        <main id="photo-viewer" className="flex-1 w-full min-w-0 flex flex-col scroll-mt-24">
          <section className="space-y-6">
            <ImageViewer src={currentPhoto.src} alt={tTrips(`${id}.photos.${currentPage}`)} />
            <div className="text-center px-4">
              <div className="min-h-[3.5rem] flex items-center justify-center mb-2">
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                  {tTrips(`${id}.photos.${currentPage}`)}
                </p>
              </div>
              <p className="text-sm font-mono text-slate-400">
                {id.toUpperCase()} / {t("page")} {currentPage}
              </p>
            </div>
          </section>
          
          <div className="mt-10">
            <TravelPagination tripId={id} currentPage={currentPage} totalPage={totalPage} />
          </div>
        </main>
        
      </div>
    </div>
  );
}