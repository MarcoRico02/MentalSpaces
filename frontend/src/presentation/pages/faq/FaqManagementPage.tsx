import React, { useState } from "react";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useFaqAllCategoriesWithQuestionsQuery } from "../../../core/aplicacion/hooks/useFaqQueries";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "../../../core/aplicacion/hooks/useFaqMutations";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/DropdownMenu";
import type {
  CategoriaFAQDTO,
  PreguntaFAQDTO,
  CategoriaPreguntasDTO,
} from "../../../core/dominio/tipos/api";

type TabType = "categories" | "questions";

interface EditingCategory extends Partial<CategoriaFAQDTO> {
  id?: number;
}

interface EditingQuestion extends Partial<PreguntaFAQDTO> {
  id?: number;
}

export const FaqManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("categories");
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(
    null
  );
  const [editingQuestion, setEditingQuestion] = useState<EditingQuestion | null>(
    null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // Queries
  const { data: categoriesWithQuestions, isLoading } =
    useFaqAllCategoriesWithQuestionsQuery();

  // Mutations
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const createQuestionMutation = useCreateQuestionMutation();
  const updateQuestionMutation = useUpdateQuestionMutation();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  // Form handlers
  const handleSaveCategory = async (category: EditingCategory) => {
    try {
      if (category.id) {
        await updateCategoryMutation.mutateAsync({
          id: category.id,
          data: category,
        });
      } else {
        await createCategoryMutation.mutateAsync(category as any);
      }
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      return;
    }
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSaveQuestion = async (question: EditingQuestion) => {
    try {
      if (question.id) {
        await updateQuestionMutation.mutateAsync({
          id: question.id,
          data: question,
        });
      } else {
        await createQuestionMutation.mutateAsync(question as any);
      }
      setEditingQuestion(null);
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) {
      return;
    }
    try {
      await deleteQuestionMutation.mutateAsync(questionId);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Administración de FAQs"
          description="Gestiona categorías y preguntas frecuentes"
        />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Administración de FAQs"
        description="Gestiona categorías y preguntas frecuentes"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-sidebar-border">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "categories"
              ? "border-b-2 border-blue-600 text-primary"
              : "text-muted-foreground hover:text-default"
          }`}
        >
          Categorías
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "questions"
              ? "border-b-2 border-blue-600 text-primary"
              : "text-muted-foreground hover:text-default"
          }`}
        >
          Preguntas
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <CategoriesTab
          categories={categoriesWithQuestions || []}
          onEdit={setEditingCategory}
          onDelete={handleDeleteCategory}
          onSave={handleSaveCategory}
          editingCategory={editingCategory}
          isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
        />
      )}

      {/* Questions Tab */}
      {activeTab === "questions" && (
        <QuestionsTab
          categories={categoriesWithQuestions || []}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
          onEdit={setEditingQuestion}
          onDelete={handleDeleteQuestion}
          onSave={handleSaveQuestion}
          editingQuestion={editingQuestion}
          isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
        />
      )}
    </div>
  );
};

interface CategoriesTabProps {
  categories: CategoriaPreguntasDTO[];
  onEdit: (category: EditingCategory | null) => void;
  onDelete: (categoryId: number) => void;
  onSave: (category: EditingCategory) => void;
  editingCategory: EditingCategory | null;
  isLoading: boolean;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  onEdit,
  onDelete,
  onSave,
  editingCategory,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => onEdit({ nombre: "", descripcion: "", orden: 0, activa: true, icono: "" })}
          className="gap-2"
        >
          <Plus size={18} />
          Nueva Categoría
        </Button>
      </div>

      {editingCategory !== null && (
        <CategoryForm
          category={editingCategory}
          onSave={onSave}
          onCancel={() => onEdit(null)}
          isLoading={isLoading}
        />
      )}

      <div className="grid gap-4">
        {categories.map((item) => (
          <div
            key={item.categoria.id}
            className="p-4 border border-sidebar-border rounded-lg hover:bg-surface-2 transition-colors bg-surface"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-default">{item.categoria.nombre}</h3>
                <p className="text-sm text-muted-foreground">{item.categoria.descripcion}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded">
                    {item.preguntas.length} preguntas
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.categoria.activa
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                    }`}
                  >
                    {item.categoria.activa ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-sidebar-border rounded">
                    <MoreVertical size={18} className="text-muted-foreground dark:text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEdit(item.categoria)}
                    className="gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(item.categoria.id!)}
                    className="gap-2 text-red-600"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CategoryFormProps {
  category: EditingCategory | null;
  onSave: (category: EditingCategory) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState<EditingCategory>(
    category || { nombre: "", descripcion: "", orden: 0, activa: true, icono: "" }
  );

  if (!category) {
    return null;
  }

  return (
    <div className="p-4 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
      <h3 className="font-semibold text-default">
        {formData.id ? "Editar Categoría" : "Nueva Categoría"}
      </h3>

      <div className="grid gap-3">
        <div>
          <label className="text-sm font-medium text-default">Nombre</label>
          <Input
            value={formData.nombre || ""}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Pagos"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-default">Descripción</label>
          <Input
            value={formData.descripcion || ""}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            placeholder="Descripción breve"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-default">Ícono</label>
            <Input
              value={formData.icono || ""}
              onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
              placeholder="Nombre del ícono"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-default">Orden</label>
            <Input
              type="number"
              value={formData.orden || 0}
              onChange={(e) =>
                setFormData({ ...formData, orden: parseInt(e.target.value) })
              }
              placeholder="1"
            />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.activa ?? true}
            onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-default">Activa</span>
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={isLoading || !formData.nombre}
        >
          {formData.id ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </div>
  );
};

interface QuestionsTabProps {
  categories: CategoriaPreguntasDTO[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  onEdit: (question: EditingQuestion | null) => void;
  onDelete: (questionId: number) => void;
  onSave: (question: EditingQuestion) => void;
  editingQuestion: EditingQuestion | null;
  isLoading: boolean;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onEdit,
  onDelete,
  onSave,
  editingQuestion,
  isLoading,
}) => {
  const selectedCategory = categories.find(
    (c) => c.categoria.id === selectedCategoryId
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <label className="text-sm font-medium text-default block mb-2">
            Seleccionar Categoría
          </label>
          <select
            value={selectedCategoryId || ""}
            onChange={(e) => onCategorySelect(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-sidebar-border rounded-lg bg-surface text-default"
          >
            <option value="">-- Selecciona una categoría --</option>
            {categories.map((item) => (
              <option key={item.categoria.id} value={item.categoria.id}>
                {item.categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {selectedCategoryId && (
          <div className="ml-4 pt-6">
            <Button
              onClick={() =>
                onEdit({
                  pregunta: "",
                  respuesta: "",
                  categoriaId: selectedCategoryId,
                  orden: 0,
                  activa: true,
                })
              }
              className="gap-2"
            >
              <Plus size={18} />
              Nueva Pregunta
            </Button>
          </div>
        )}
      </div>

      {editingQuestion !== null && (
        <QuestionForm
          question={editingQuestion}
          onSave={onSave}
          onCancel={() => onEdit(null)}
          isLoading={isLoading}
        />
      )}

      {selectedCategory && (
        <div className="space-y-3">
          {selectedCategory.preguntas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay preguntas en esta categoría
            </div>
          ) : (
            selectedCategory.preguntas.map((question) => (
              <div
                key={question.id}
                className="p-4 border border-sidebar-border rounded-lg hover:bg-surface-2 transition-colors bg-surface"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-default">{question.pregunta}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.respuesta}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 rounded">
                        Orden: {question.orden}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          question.activa
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                        }`}
                      >
                        {question.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-sidebar-border rounded">
                        <MoreVertical size={18} className="text-muted-foreground dark:text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(question)}
                        className="gap-2"
                      >
                        <Edit size={16} />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(question.id!)}
                        className="gap-2 text-red-600"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface QuestionFormProps {
  question: EditingQuestion | null;
  onSave: (question: EditingQuestion) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState<EditingQuestion>(
    question || { categoriaId: 0, pregunta: "", respuesta: "", orden: 0, activa: true }
  );

  if (!question) {
    return null;
  }

  return (
    <div className="p-4 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
      <h3 className="font-semibold text-default">
        {formData.id ? "Editar Pregunta" : "Nueva Pregunta"}
      </h3>

      <div className="grid gap-3">
        <div>
          <label className="text-sm font-medium text-default">Pregunta</label>
          <Input
            value={formData.pregunta || ""}
            onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
            placeholder="Escribe la pregunta"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-default">Respuesta</label>
          <textarea
            value={formData.respuesta || ""}
            onChange={(e) =>
              setFormData({ ...formData, respuesta: e.target.value })
            }
            placeholder="Escribe la respuesta"
            className="w-full px-3 py-2 border border-sidebar-border rounded-lg bg-surface text-default min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-default">Orden</label>
            <Input
              type="number"
              value={formData.orden || 0}
              onChange={(e) =>
                setFormData({ ...formData, orden: parseInt(e.target.value) })
              }
              placeholder="1"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={formData.activa ?? true}
                onChange={(e) =>
                  setFormData({ ...formData, activa: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm text-default">Activa</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={isLoading || !formData.pregunta || !formData.respuesta}
        >
          {formData.id ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </div>
  );
};

