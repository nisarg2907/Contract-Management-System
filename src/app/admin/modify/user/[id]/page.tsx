'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form';
import { CombinedUserSchema, UpdateUserSchema } from '@/types/user';
import axios from 'axios';

type FormData = z.infer<typeof CombinedUserSchema>;

export default function EditUser() {
  const id = useParams()?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FormData>({
    id: '',
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(id === 'new');

  const form = useForm<FormData>({
    resolver: zodResolver(CombinedUserSchema),
    defaultValues: data,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error('404 - Page Not Found');
        setLoading(false);
        return;
      }

      if (id === 'new') {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/user?id=${id}`);
        console.log("user", response.data.data);
        const user =  response.data.data.user;
        const validatedData = UpdateUserSchema.parse(user);
        setData(validatedData);
        form.reset(validatedData);
      } catch (err){
        console.log("erro",err)
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const endpoint = id === 'new' ? '/api/user' : `/api/user?id=${id}`;
      const method = id === 'new' ? 'POST' : 'PUT';
      await axios({ method, url: endpoint, data: id ? { ...formData, id } : formData });

      toast.success('Form submitted successfully');
      router.push('/admin/user');
    } catch {
      toast.error('Failed to submit User.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {id === 'new' ? 'Add New User' : 'Edit User'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Enter user name"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Enter user email"
                        {...field}
                        disabled={isSubmitting || (id !== 'new' && !!id)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {id !== 'new' && (
                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={() => setShowPasswordField(!showPasswordField)}
                    disabled={isSubmitting}
                  >
                    {showPasswordField ? 'Cancel Change Password' : 'Change User Password'}
                  </Button>
                </div>
              )}

              {showPasswordField && (
                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="Enter user password"
                          type="password"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="space-y-4">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
