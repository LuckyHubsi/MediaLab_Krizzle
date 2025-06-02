import React, { createContext, useContext, ReactNode } from "react";
import { useRepositories } from "./RepositoryContext";
import { TagService } from "@/backend/service/TagService";
import { GeneralPageService } from "@/backend/service/GeneralPageService";
import { NoteService } from "@/backend/service/NoteService";
import { ItemTemplateService } from "@/backend/service/ItemTemplateService";
import { CollectionService } from "@/backend/service/CollectionService";
import { FolderService } from "@/backend/service/FolderService";

/**
 * Provides application-level services via React context.
 * All services depend on corresponding repositories from the RepositoryContext.
 */

/**
 * The shape of the ServiceContext value.
 */
type ServiceContextType = {
  tagService: TagService;
  generalPageService: GeneralPageService;
  noteService: NoteService;
  itemTemplateService: ItemTemplateService;
  collectionService: CollectionService;
  folderService: FolderService;
};

/**
 * React Context for accessing application services.
 */
const ServiceContext = createContext<ServiceContextType | null>(null);

/**
 * ServiceProvider initializes and provides services to the app.
 * It consumes repositories from RepositoryContext and wires up services,
 * which encapsulate business logic and orchestrate repository access.
 *
 * @param children - React children components that can consume services.
 */
export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const {
    baseRepository,
    tagRepository,
    generalPageRepository,
    noteRepository,
    itemTemplateRepository,
    attributeRepository,
    collectionRepository,
    collectionCategoryRepository,
    itemRepository,
    folderRepository,
  } = useRepositories();

  const tagService = new TagService(tagRepository);
  const generalPageService = new GeneralPageService(
    generalPageRepository,
    baseRepository,
  );
  const noteService = new NoteService(noteRepository);
  const itemTemplateService = new ItemTemplateService(
    itemTemplateRepository,
    attributeRepository,
    itemRepository,
    generalPageRepository,
  );
  const collectionService = new CollectionService(
    baseRepository,
    collectionRepository,
    generalPageRepository,
    itemTemplateRepository,
    attributeRepository,
    collectionCategoryRepository,
    itemRepository,
  );
  const folderService = new FolderService(folderRepository);

  return (
    <ServiceContext.Provider
      value={{
        tagService,
        generalPageService,
        noteService,
        itemTemplateService,
        collectionService,
        folderService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Hook to access application services.
 * Must be used inside a <ServiceProvider>. Throws an error if not.
 *
 * @returns {ServiceContextType} Object containing all available services.
 */
export const useServices = () => {
  const ctx = useContext(ServiceContext);
  if (!ctx)
    throw new Error("useServices must be used inside a ServiceProvider");
  return ctx;
};
