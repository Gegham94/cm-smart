import { Injectable } from '@angular/core';
import { Skill } from '@models/skill';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  constructor() {}

  private skillsData: Skill[] = [
    {
      name: 'Java Script',
      rating: 5,
      icon: '/assets/icons/skills-icons/javascript.svg',
    },
    {
      name: 'MongoDB',
      rating: 5,
      icon: '/assets/icons/skills-icons/mongodb.svg',
    },
    {
      name: 'React JS',
      rating: 3,
      icon: '/assets/icons/skills-icons/reactjs.svg',
    },
    {
      name: 'Angular',
      rating: 2,
      icon: '/assets/icons/skills-icons/angular.svg',
    },
    {
      name: 'PostgreSQL',
      rating: 1,
      icon: '/assets/icons/skills-icons/postgresql.svg',
    },
    {
      name: 'jQuery',
      rating: 5,
      icon: '/assets/icons/skills-icons/jquery.svg',
    },
    {
      name: 'MYSQL',
      rating: 4,
      icon: '/assets/icons/skills-icons/mysql.svg',
    },
    {
      name: 'NodeJS',
      rating: 4,
      icon: '/assets/icons/skills-icons/nodejs.svg',
    },
    {
      name: 'PHP',
      rating: 1,
      icon: '/assets/icons/skills-icons/php.svg',
    },
    {
      name: 'Ruby',
      rating: 1,
      icon: '/assets/icons/skills-icons/ruby.svg',
    },
    {
      name: 'CSS3',
      rating: 5,
      icon: '/assets/icons/skills-icons/css3.svg',
    },
    {
      name: 'HTML5',
      rating: 5,
      icon: '/assets/icons/skills-icons/html5.svg',
    },
    {
      name: 'Wordpress',
      rating: 5,
      icon: '/assets/icons/skills-icons/wordpress.svg',
    },
    {
      name: 'GraphQL',
      rating: 3,
      icon: '/assets/icons/skills-icons/graphql.svg',
    },
    {
      name: 'Python',
      rating: 1,
      icon: '/assets/icons/skills-icons/python.svg',
    },
  ];

  get skills(): Skill[] {
    return this.skillsData;
  }
}
