import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, User, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const scheduleSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp deve ter no mínimo 10 dígitos"),
  preferredTime: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleModal = ({ open, onOpenChange }: ScheduleModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      preferredTime: "",
    },
  });

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    
    return value;
  };

  const handleWhatsAppChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatWhatsApp(value);
    onChange(formatted);
  };

  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-schedule-email', {
        body: {
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          preferredTime: data.preferredTime,
        },
      });

      if (error) {
        console.error('Error sending email:', error);
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
      
      toast({
        title: "Diagnóstico agendado!",
        description: "Entraremos em contato em breve.",
      });

      // Reset após 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
        form.reset();
        onOpenChange(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSuccess(false);
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-black text-jung-dark mb-2">
            Agendar Diagnóstico Gratuito
          </DialogTitle>
          <DialogDescription className="text-gray-600 jung-body">
            Preencha os dados abaixo e entraremos em contato para agendar seu diagnóstico gratuito.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-scale-in" />
            <h3 className="text-xl font-bold text-jung-dark mb-2">
              Diagnóstico Agendado!
            </h3>
            <p className="text-gray-600 jung-body">
              Recebemos seus dados. Nossa equipe entrará em contato em breve para confirmar o horário.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 jung-menu text-jung-dark">
                      <User className="w-4 h-4" />
                      Nome *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        {...field}
                        className="jung-body"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 jung-menu text-jung-dark">
                      <Mail className="w-4 h-4" />
                      E-mail *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        className="jung-body"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 jung-menu text-jung-dark">
                      <Phone className="w-4 h-4" />
                      WhatsApp *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(11) 99999-9999"
                        {...field}
                        onChange={(e) => handleWhatsAppChange(e.target.value, field.onChange)}
                        className="jung-body"
                        disabled={isSubmitting}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 jung-menu text-jung-dark">
                      <Clock className="w-4 h-4" />
                      Melhor horário para contato
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="jung-body">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Manhã (8h às 12h)</SelectItem>
                        <SelectItem value="afternoon">Tarde (12h às 18h)</SelectItem>
                        <SelectItem value="evening">Noite (18h às 20h)</SelectItem>
                        <SelectItem value="flexible">Horário flexível</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-jung-pink hover:bg-jung-pink/90 text-white font-bold py-3 rounded-xl jung-body animate-pulse-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  "Agendar Diagnóstico Gratuito"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};