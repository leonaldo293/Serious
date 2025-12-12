'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/user';
import { useToast } from '@/components/Toast';
import AuthGuard from '@/components/AuthGuard';
import { ProfileSkeleton } from '@/components/SkeletonLoader';

export const dynamic = 'force-dynamic';

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    github: user?.github || ''
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const data = await userService.getCurrentUser();
      setProfileData(data);
      setFormData({
        firstName: (data as any).firstName || user?.firstName || '',
        lastName: (data as any).lastName || user?.lastName || '',
        email: (data as any).email || user?.email || '',
        phone: (data as any).phone || user?.phone || '',
        bio: (data as any).bio || '',
        location: (data as any).location || '',
        website: (data as any).website || '',
        linkedin: (data as any).linkedin || '',
        github: (data as any).github || ''
      });
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      showToast({
        type: 'error',
        title: 'Erro ao carregar perfil',
        message: 'Não foi possível carregar seus dados'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await userService.updateProfile(formData);
      showToast({
        type: 'success',
        title: 'Perfil atualizado com sucesso!',
        message: 'Suas informações foram salvas'
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      showToast({
        type: 'error',
        title: 'Erro ao atualizar perfil',
        message: 'Não foi possível salvar suas alterações'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || ''
      });
    }
    setIsEditing(false);
  };

  if (loading && !profileData) {
    return (
      <AuthGuard>
        <ProfileSkeleton />
      </AuthGuard>
    );
  }

  if (!isEditing) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-deep-charcoal dark:text-pure-white">
                    Meu Perfil
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
                    disabled={loading}
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-24 h-24 bg-african-gold rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-deep-charcoal">
                      {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-deep-charcoal dark:text-pure-white">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user?.role === 'admin' ? 'Administrador' : 
                       user?.role === 'superadmin' ? 'Super Administrador' :
                       user?.role === 'mentor' ? 'Mentor' : 'Usuário'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium text-deep-charcoal dark:text-pure-white mb-4">
                      Informações Pessoais
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nome Completo
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.firstName} {formData.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Telefone
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.phone || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Localização
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.location || 'Não informada'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-medium text-deep-charcoal dark:text-pure-white mb-4">
                      Informações Profissionais
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Biografia
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.bio || 'Nenhuma biografia informada'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Website
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.website ? (
                            <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-african-gold hover:text-african-gold/80">
                              {formData.website}
                            </a>
                          ) : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          LinkedIn
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.linkedin ? (
                            <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-african-gold hover:text-african-gold/80">
                              {formData.linkedin}
                            </a>
                          ) : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          GitHub
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-pure-white">
                          {formData.github ? (
                            <a href={formData.github} target="_blank" rel="noopener noreferrer" className="text-african-gold hover:text-african-gold/80">
                              {formData.github}
                            </a>
                          ) : 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Estatísticas da Conta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-african-gold">
                        {profileData?.statistics?.coursesCompleted || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Cursos Concluídos</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-tech-teal">
                        {profileData?.statistics?.totalHoursWatched || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Horas de Estudo</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-african-gold">
                        {profileData?.statistics?.certificatesEarned || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Certificados</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-tech-teal">
                        {profileData?.statistics?.streakDays || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Dias de Estudo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  // Edit Form
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-deep-charcoal dark:text-pure-white">
                  Editar Perfil
                </h1>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-deep-charcoal dark:text-pure-white mb-4">
                    Informações Pessoais
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                        disabled
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Email não pode ser alterado
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Localização
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-medium text-deep-charcoal dark:text-pure-white mb-4">
                    Informações Profissionais
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Biografia
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                        placeholder="Fale um pouco sobre você..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                        placeholder="https://seusite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                        placeholder="https://linkedin.com/in/seuperfil"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GitHub
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                        placeholder="https://github.com/seuusuario"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
