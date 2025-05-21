import React, { createContext, useContext, ReactNode } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { TagRepositoryImpl } from "@/backend/repository/implementation/TagRepository.implementation";
import { GeneralPageRepositoryImpl } from "@/backend/repository/implementation/GeneralPageRepository.implementation";
import { NoteRepositoryImpl } from "@/backend/repository/implementation/NoteRepository.implementation";
import { ItemTemplateRepositoryImpl } from "@/backend/repository/implementation/ItemTemplateRepository.implementation";
import { AttributeRepositoryImpl } from "@/backend/repository/implementation/AttributeRepository.implementation";
import { BaseRepositoryImpl } from "@/backend/repository/implementation/BaseRepository.implementation";
import { CollectionRepositoryImpl } from "@/backend/repository/implementation/CollectionRepository.implementation";
import { CollectionCategoryRepositoryImpl } from "@/backend/repository/implementation/CollectionCategoryRepository.implementation";
import { ItemRepositoryImpl } from "@/backend/repository/implementation/ItemRepository.implementation";

/**
 * Provides access to all repository implementations via React context.
 * Repositories are initialized with a shared SQLite database instance from SQLiteProvider.
 */

/**
 * The shape of the RepositoryContext value.
 */
type RepositoryContextType = {
  baseRepository: BaseRepositoryImpl;
  tagRepository: TagRepositoryImpl;
  generalPageRepository: GeneralPageRepositoryImpl;
  noteRepository: NoteRepositoryImpl;
  itemTemplateRepository: ItemTemplateRepositoryImpl;
  attributeRepository: AttributeRepositoryImpl;
  collectionRepository: CollectionRepositoryImpl;
  collectionCategoryRepository: CollectionCategoryRepositoryImpl;
  itemRepository: ItemRepositoryImpl;
};

/**
 * React Context for accessing repository instances.
 */
const RepositoryContext = createContext<RepositoryContextType | null>(null);

/**
 * RepositoryProvider initializes repository implementations and provides them to the app.
 * All repositories share a single SQLite database instance provided by SQLiteProvider.
 * This allows them to be accessed throughout the app using the `useRepositories` hook.
 *
 * @param children - React children components that can consume the repository context.
 */
export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();

  const baseRepository = new BaseRepositoryImpl(db);
  const tagRepository = new TagRepositoryImpl(db);
  const generalPageRepository = new GeneralPageRepositoryImpl(db);
  const noteRepository = new NoteRepositoryImpl(db);
  const itemTemplateRepository = new ItemTemplateRepositoryImpl(db);
  const attributeRepository = new AttributeRepositoryImpl(db);
  const collectionRepository = new CollectionRepositoryImpl(db);
  const collectionCategoryRepository = new CollectionCategoryRepositoryImpl(db);
  const itemRepository = new ItemRepositoryImpl(db);

  return (
    <RepositoryContext.Provider
      value={{
        baseRepository,
        tagRepository,
        generalPageRepository,
        noteRepository,
        itemTemplateRepository,
        attributeRepository,
        collectionRepository,
        collectionCategoryRepository,
        itemRepository,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};

/**
 * Hook to access repository instances.
 * Must be used inside a <RepositoryProvider>. Throws an error if not.
 *
 * @returns {RepositoryContextType} Object containing all available repositories.
 */
export const useRepositories = () => {
  const ctx = useContext(RepositoryContext);
  if (!ctx)
    throw new Error("useRepositories must be used inside a RepositoryProvider");
  return ctx;
};
