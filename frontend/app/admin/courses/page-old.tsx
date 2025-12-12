'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Filter, Edit, Trash2, Eye, Users, Clock, Star } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { ProgramsAPI } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  enrolledStudents: number;
  rating: number;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

export default function AdminCoursesPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, filterStatus]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log("Admin API: Fetching courses");
      
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      };
      
      const response = await ProgramsAPI.getPrograms(params);
      console.log("Admin API courses response:", response);
      
      // Garantir que sempre temos array
      const coursesData = Array.isArray(response?.data) ? response.data : 
                         Array.isArray(response?.programs) ? response.programs : 
                         Array.isArray(response) ? response : [];
      
      setCourses(coursesData);
    } catch (error) {
      console.error('Admin API Courses Error:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      console.log("Admin API: Creating course:", courseData);
      const response = await ProgramsAPI.createProgram(courseData);
      console.log("Admin API create course response:", response);
      
      await fetchCourses();
      showToast({ title: 'Sucesso', message: 'Curso criado com sucesso!', type: 'success' });
      return { success: true, data: response };
    } catch (error) {
      console.error('Admin API Create Course Error:', error);
      showToast({ title: 'Erro', message: 'Erro ao criar curso', type: 'error' });
      return { success: false, error };
    }
  };

  const handleUpdateCourse = async (id: string, courseData: any) => {
    try {
      console.log("Admin API: Updating course:", id, courseData);
      const response = await ProgramsAPI.updateProgram(id, courseData);
      console.log("Admin API update course response:", response);
      
      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...response } : course
      ));
      showToast({ title: 'Sucesso', message: 'Curso atualizado com sucesso!', type: 'success' });
      return { success: true, data: response };
    } catch (error) {
      console.error('Admin API Update Course Error:', error);
      showToast({ title: 'Erro', message: 'Erro ao atualizar curso', type: 'error' });
      return { success: false, error };
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      console.log("Admin API: Deleting course:", id);
      await ProgramsAPI.deleteProgram(id);
      console.log("Admin API delete course success");
      
      setCourses(prev => prev.filter(course => course.id !== id));
      showToast({ title: 'Sucesso', message: 'Curso deletado com sucesso!', type: 'success' });
      return { success: true };
    } catch (error) {
      console.error('Admin API Delete Course Error:', error);
      showToast({ title: 'Erro', message: 'Erro ao deletar curso', type: 'error' });
      return { success: false, error };
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (courseId: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      await handleDeleteCourse(courseId);
    }
  };

  const getStatusBadge = (status: Course['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };

    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      draft: 'Rascunho',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os cursos da plataforma
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-african-gold text-deep-charcoal rounded-lg hover:opacity-90 transition">
          <Plus className="w-5 h-5" />
          <span>Novo Curso</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-african-gold focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-african-gold focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="draft">Rascunhos</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Cursos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-african-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cursos Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-tech-teal" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Média de Avaliação</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Instrutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Alunos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avaliação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {course.category} • {course.level}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{course.instructor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Users className="w-4 h-4 mr-1" />
                      {course.enrolledStudents}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">{course.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'Nenhum curso encontrado com os filtros aplicados.'
              : 'Nenhum curso cadastrado ainda.'}
          </p>
        </div>
      )}
    </div>
  );
}
