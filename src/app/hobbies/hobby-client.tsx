"use client";

import type { Hobby } from "@/lib/types";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HobbyClient({
  category,
  items,
}: {
  category: string;
  items: Hobby[];
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  switch (category) {
    case "photography":
      return (
        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="break-inside-avoid group relative overflow-hidden rounded-xl border border-card-border bg-card-bg hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => setLightbox(item.cover_url)}
            >
              {item.cover_url && (
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-muted mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Lightbox */}
          {lightbox && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setLightbox(null)}
            >
              <img
                src={lightbox}
                alt=""
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      );

    case "music":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <motion.a
              key={item.id}
              href={item.link || "#"}
              target={item.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-4 rounded-xl border border-card-border bg-card-bg hover:border-primary/30 transition-all text-center"
            >
              {item.cover_url && (
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <h3 className="text-sm font-medium truncate">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted mt-1 line-clamp-1">
                  {item.description}
                </p>
              )}
            </motion.a>
          ))}
        </div>
      );

    case "skills":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-4 rounded-xl border border-card-border bg-card-bg hover:border-primary/30 transition-all"
            >
              {item.cover_url && (
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="w-10 h-10 mb-3 rounded-lg"
                />
              )}
              <h3 className="text-sm font-medium">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted mt-1">{item.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      );

    case "gaming":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl border border-card-border bg-card-bg hover:border-primary/30 transition-all"
            >
              {item.cover_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-primary hover:underline"
                  >
                    了解更多 →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      );

    case "reading":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <motion.a
              key={item.id}
              href={item.link || "#"}
              target={item.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              {item.cover_url && (
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-2">
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <h3 className="text-sm font-medium text-center truncate">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-muted text-center mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              )}
            </motion.a>
          ))}
        </div>
      );

    default:
      return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {items.map((item) => (
            <motion.a
              key={item.id}
              href={item.link || "#"}
              target={item.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-4 rounded-xl border border-card-border bg-card-bg hover:border-primary/30 transition-all"
            >
              {item.cover_url ? (
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="w-12 h-12 rounded-xl mb-2 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-card-border mb-2 flex items-center justify-center text-lg">
                  ❤️
                </div>
              )}
              <span className="text-xs text-center font-medium">
                {item.title}
              </span>
            </motion.a>
          ))}
        </div>
      );
  }
}
