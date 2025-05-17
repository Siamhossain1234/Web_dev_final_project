const supabase = require('../config/supabase')

class Project {
  static async create(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
    
    if (error) throw error
    return data[0]
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        users:project_users(user_id),
        tickets(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  //find by owner
  static async findByOwnerId(ownerId) {
    const { data, error } = await supabase
      .from('projects')
      .select(`*`)
      .eq('owner_id', ownerId)
  
    if (error) throw error
    return data
  }
  

  static async findByCode(code){
    const {data,error} = await supabase
    .from('projects').select('id').eq('join_code',code).maybeSingle()
    if (error) throw error
    return data
  }

  static async addUser(projectId, userId) {
    const { data, error } = await supabase
      .from('project_users')
      .insert({ project_id: projectId, user_id: userId }).select()
    
    if (error) throw error
    return data
  }

  static async getUserProjects(userId) {
    const { data, error } = await supabase
      .from('project_users')
      .select(`
        projects(*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data.map(item => item.projects)
  }

  static async getProjectUsers(projectId) {
    const { data, error } = await supabase
      .from('project_users')
      .select(`
        users:user_id (
          id,
          name,
          email
        )
      `)
      .eq('project_id', projectId)
    
    if (error) throw error
    return data.map(item => item.users)
  }
}

module.exports = Project