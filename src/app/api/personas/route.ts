// src/app/api/personas/route.ts
// API endpoint to fetch personas from Neon DB

import { NextRequest, NextResponse } from 'next/server';
import { getAllPersonas, getPersonaByKey } from '@/app/actions';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const personaKey = searchParams.get('key');

    // If a specific persona is requested
    if (personaKey) {
      const persona = await getPersonaByKey(personaKey);

      if (!persona) {
        return NextResponse.json(
          { error: 'Persona not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(persona);
    }

    // Return all enabled personas
    const personas = await getAllPersonas();

    // Transform to match the expected format
    const transformedPersonas = personas.reduce((acc: any, persona: any) => {
      acc[persona.persona_key] = {
        id: persona.persona_key,
        name: persona.name,
        title: persona.title,
        avatar: persona.avatar_url,
        avatarUrl: persona.avatar_url,
        description: persona.description,
        specialty: persona.specialty,
        enabled: persona.is_enabled,
        greeting: persona.greeting_message,
        systemPrompt: persona.system_prompt,
        metadata: persona.metadata,
      };
      return acc;
    }, {});

    return NextResponse.json({
      personas: transformedPersonas,
      count: personas.length,
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personas' },
      { status: 500 }
    );
  }
}
