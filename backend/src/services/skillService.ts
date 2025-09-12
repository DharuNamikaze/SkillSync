import Skill from '../models/Skill';
import { CreateSkillRequest, UpdateSkillRequest, ISkill } from '../types';
import { createError } from '../middleware/errorHandler';

export class SkillService {
  async createSkill(userId: string, skillData: CreateSkillRequest): Promise<ISkill> {
    try {
      const skill = new Skill({
        userId,
        ...skillData
      });
      
      await skill.save();
      return skill;
    } catch (error) {
      console.error('Create skill error:', error);
      throw error;
    }
  }

  async getUserSkills(userId: string): Promise<ISkill[]> {
    try {
      const skills = await Skill.find({ userId }).sort({ createdAt: -1 });
      return skills;
    } catch (error) {
      console.error('Get user skills error:', error);
      throw error;
    }
  }

  async getSkillById(skillId: string, userId: string): Promise<ISkill | null> {
    try {
      const skill = await Skill.findOne({ _id: skillId, userId });
      return skill;
    } catch (error) {
      console.error('Get skill by ID error:', error);
      throw error;
    }
  }

  async updateSkill(skillId: string, userId: string, updateData: UpdateSkillRequest): Promise<ISkill | null> {
    try {
      const skill = await Skill.findOneAndUpdate(
        { _id: skillId, userId },
        updateData,
        { new: true }
      );
      return skill;
    } catch (error) {
      console.error('Update skill error:', error);
      throw error;
    }
  }

  async deleteSkill(skillId: string, userId: string): Promise<boolean> {
    try {
      const result = await Skill.findOneAndDelete({ _id: skillId, userId });
      return !!result;
    } catch (error) {
      console.error('Delete skill error:', error);
      throw error;
    }
  }

  async getSkillsByCategory(userId: string, category: string): Promise<ISkill[]> {
    try {
      const skills = await Skill.find({ userId, category }).sort({ createdAt: -1 });
      return skills;
    } catch (error) {
      console.error('Get skills by category error:', error);
      throw error;
    }
  }

  async searchSkills(userId: string, searchTerm: string): Promise<ISkill[]> {
    try {
      const skills = await Skill.find({
        userId,
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
      
      return skills;
    } catch (error) {
      console.error('Search skills error:', error);
      throw error;
    }
  }

  async getSkillCategories(userId: string): Promise<string[]> {
    try {
      const categories = await Skill.distinct('category', { userId });
      return categories;
    } catch (error) {
      console.error('Get skill categories error:', error);
      throw error;
    }
  }
}
