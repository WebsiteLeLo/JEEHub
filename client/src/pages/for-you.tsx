import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SimpleModal } from '@/components/simple-modal';
import { Heart, BookOpen, Plus, Edit2, Trash2, Sparkles, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'jee-student-notes';

const MOTIVATIONAL_QUOTES = [
  {
    english: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    hindi: "सफलता अंतिम नहीं है, विफलता घातक नहीं है: जारी रखने का साहस ही मायने रखता है।",
    author: "Winston Churchill"
  },
  {
    english: "The expert in anything was once a beginner.",
    hindi: "किसी भी चीज़ में विशेषज्ञ भी एक समय शुरुआती था।",
    author: "Helen Hayes"
  },
  {
    english: "Don't watch the clock; do what it does. Keep going.",
    hindi: "घड़ी को मत देखो; वह जो करती है वह करो। चलते रहो।",
    author: "Sam Levenson"
  },
  {
    english: "Believe you can and you're halfway there.",
    hindi: "विश्वास करो कि तुम कर सकते हो और तुम आधे रास्ते पर हो।",
    author: "Theodore Roosevelt"
  },
  {
    english: "The future belongs to those who believe in the beauty of their dreams.",
    hindi: "भविष्य उन लोगों का है जो अपने सपनों की सुंदरता में विश्वास करते हैं।",
    author: "Eleanor Roosevelt"
  },
  {
    english: "It does not matter how slowly you go as long as you do not stop.",
    hindi: "इससे कोई फर्क नहीं पड़ता कि तुम कितनी धीरे जाते हो जब तक तुम रुकते नहीं।",
    author: "Confucius"
  },
  {
    english: "Success usually comes to those who are too busy to be looking for it.",
    hindi: "सफलता आमतौर पर उन लोगों के पास आती है जो इसे ढूंढने में बहुत व्यस्त हैं।",
    author: "Henry David Thoreau"
  },
  {
    english: "The only way to do great work is to love what you do.",
    hindi: "महान कार्य करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।",
    author: "Steve Jobs"
  }
];

const MOTIVATIONAL_IMAGES = [
  {
    title: "Stay Focused",
    description: "Keep your eyes on the goal",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    title: "Dream Big",
    description: "Your potential is limitless",
    gradient: "from-green-500 to-teal-600"
  },
  {
    title: "Never Give Up",
    description: "Every step counts",
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "Believe in Yourself",
    description: "You are capable of amazing things",
    gradient: "from-pink-500 to-rose-600"
  }
];

export default function ForYou() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }

    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuoteIndex(randomIndex);
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingNote(null);
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    const newNote: Note = {
      id: editingNote?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      createdAt: editingNote?.createdAt || new Date().toISOString()
    };

    let updatedNotes;
    if (editingNote) {
      updatedNotes = notes.map(note => 
        note.id === editingNote.id ? newNote : note
      );
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully.",
      });
    } else {
      updatedNotes = [...notes, newNote];
      toast({
        title: "Note Added",
        description: "New note has been added successfully.",
      });
    }

    saveNotes(updatedNotes);
    setIsAddNoteModalOpen(false);
    resetForm();
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content
    });
    setIsAddNoteModalOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    toast({
      title: "Note Deleted",
      description: "Your note has been deleted successfully.",
    });
  };

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[currentQuoteIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={28} />
            For You
          </h1>
          <p className="text-muted-foreground">Motivation, inspiration, and your personal notes</p>
        </div>
      </div>

      <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-500" size={20} />
            Daily Motivation
          </CardTitle>
          <CardDescription>Let these words inspire your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg font-medium text-foreground mb-2">
                "{currentQuote.english}"
              </p>
              <p className="text-base text-muted-foreground italic mb-2">
                "{currentQuote.hindi}"
              </p>
              <p className="text-sm text-muted-foreground text-right">
                - {currentQuote.author}
              </p>
            </div>
            
            <Button 
              onClick={nextQuote} 
              variant="outline" 
              className="w-full"
              data-testid="button-next-quote"
            >
              <Sparkles size={16} className="mr-2" />
              Get New Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="text-purple-500" size={20} />
            Motivational Cards
          </CardTitle>
          <CardDescription>Visual inspiration for your JEE journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOTIVATIONAL_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`relative h-40 rounded-lg bg-gradient-to-br ${image.gradient} p-6 flex flex-col justify-end text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                data-testid={`card-motivation-${index}`}
              >
                <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                <p className="text-sm opacity-90">{image.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="text-green-500" size={20} />
                My Notes
              </CardTitle>
              <CardDescription>Keep track of important points and ideas</CardDescription>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setIsAddNoteModalOpen(true);
              }}
              className="flex items-center gap-2"
              data-testid="button-add-note"
            >
              <Plus size={16} />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="mx-auto mb-4 opacity-50" size={48} />
              <p>No notes yet. Start adding your important notes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow" data-testid={`card-note-${note.id}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {note.content}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                        className="flex-1"
                        data-testid={`button-edit-note-${note.id}`}
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="flex-1 text-red-500 hover:text-red-700"
                        data-testid={`button-delete-note-${note.id}`}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SimpleModal
        open={isAddNoteModalOpen}
        onClose={() => {
          setIsAddNoteModalOpen(false);
          resetForm();
        }}
        title={editingNote ? 'Edit Note' : 'Add New Note'}
        size="md"
      >
        <form onSubmit={handleSubmitNote} className="space-y-4">
          <div>
            <Label htmlFor="note-title">Title *</Label>
            <Input
              id="note-title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Important Formula"
              required
              data-testid="input-note-title"
            />
          </div>

          <div>
            <Label htmlFor="note-content">Content *</Label>
            <Textarea
              id="note-content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Write your note here..."
              rows={6}
              required
              data-testid="input-note-content"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsAddNoteModalOpen(false);
                resetForm();
              }}
              className="flex-1"
              data-testid="button-cancel-note"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1"
              data-testid="button-submit-note"
            >
              {editingNote ? 'Update' : 'Add'} Note
            </Button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}
