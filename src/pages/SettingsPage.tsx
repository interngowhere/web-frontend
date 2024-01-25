import { NavBarWrapper } from '@/components/layout/wrappers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/Tabs';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
    const { section } = useParams();
    const navigate = useNavigate();
    return (
        <NavBarWrapper>
            <div className="flex min-h-[calc(100vh-3.5rem)] w-full place-content-center bg-gray-100">
                <Tabs value={section} className="m-6 w-full max-w-2xl p-8 md:m-12">
                    <TabsList>
                        <TabsTrigger value="account" onClick={() => navigate('/settings/account')}>
                            Account
                        </TabsTrigger>
                        <TabsTrigger
                            value="password"
                            onClick={() => navigate('/settings/password')}
                        >
                            Password
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <div className="w-full rounded-md bg-white p-4 shadow">
                            Make changes to your account here.
                        </div>
                    </TabsContent>
                    <TabsContent value="password">
                        <div className="w-full rounded-md bg-white p-4 shadow">
                            Make changes to your password here.
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </NavBarWrapper>
    );
}
