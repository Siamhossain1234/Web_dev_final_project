const supabase = require('../config/supabase')

class User {
  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
    
    if (error) throw error
    return data[0]
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()
    
    if (error) throw error
    return data
  }
}

module.exports = User